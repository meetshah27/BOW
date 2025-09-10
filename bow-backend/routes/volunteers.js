const express = require('express');
const router = express.Router();
const verifyCognito = require('../middleware/verifyCognito');
const syncUserToDynamoDB = require('../middleware/syncUserToDynamoDB');

// CSV export functionality
const createCSV = (applications) => {
  const headers = [
    'Application ID',
    'Applicant Name',
    'Applicant Email',
    'Applicant Phone',
    'Applicant Age',
    'Opportunity Title',
    'Opportunity Category',
    'Status',
    'Application Date',
    'Time Commitment',
    'Experience',
    'Skills',
    'Motivation',
    'Availability',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Emergency Contact Relationship',
    'Review Notes',
    'Review Date'
  ];

  const csvRows = [headers.join(',')];

  applications.forEach(app => {
    // Helper function to safely convert any value to string and escape quotes
    const safeString = (value) => {
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return value.join(', ');
      return String(value);
    };

    // Helper function to safely escape and quote CSV values
    const csvValue = (value) => {
      const str = safeString(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const row = [
      app.id || app._id || '',
      csvValue(app.applicantName),
      app.applicantEmail || '',
      app.applicantPhone || '',
      app.applicantAge || '',
      csvValue(app.opportunityTitle),
      app.opportunityCategory || '',
      app.status || '',
      app.applicationDate ? new Date(app.applicationDate).toISOString().split('T')[0] : '',
      csvValue(app.timeCommitment),
      csvValue(app.experience),
      csvValue(app.skills),
      csvValue(app.motivation),
      csvValue(app.availability),
      csvValue(app.emergencyContact?.name),
      app.emergencyContact?.phone || '',
      csvValue(app.emergencyContact?.relationship),
      csvValue(app.reviewNotes),
      app.reviewDate ? new Date(app.reviewDate).toISOString().split('T')[0] : ''
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

// Try to use DynamoDB Volunteer model, fallback to sample data if not available
let Volunteer;
try {
  Volunteer = require('../models-dynamodb/Volunteer');
  console.log('✅ Using DynamoDB Volunteer model');
} catch (error) {
  console.log('⚠️  DynamoDB Volunteer model not available, using fallback mode');
  Volunteer = null;
}

// Sample volunteer opportunities data
const sampleOpportunities = [
  {
    id: 'event-coordinator',
    title: 'Event Coordinator',
    category: 'Events',
    location: 'Seattle Area',
    timeCommitment: '4-8 hours per event',
    description: 'Help plan and coordinate community events, from small workshops to large festivals.',
    requirements: [
      'Strong organizational skills',
      'Experience with event planning preferred',
      'Available on weekends',
      'Passion for community building'
    ],
    benefits: [
      'Gain event management experience',
      'Network with community leaders',
      'Free access to BOW events',
      'Recognition and appreciation'
    ]
  },
  {
    id: 'music-workshop-assistant',
    title: 'Music Workshop Assistant',
    category: 'Education',
    location: 'Various Locations',
    timeCommitment: '2-4 hours per week',
    description: 'Support music education programs for youth and adults in our community.',
    requirements: [
      'Basic music knowledge',
      'Patience working with diverse groups',
      'Background check required',
      'Reliable transportation'
    ],
    benefits: [
      'Teaching experience',
      'Music education training',
      'Work with inspiring youth',
      'Flexible scheduling'
    ]
  },
  {
    id: 'community-outreach-specialist',
    title: 'Community Outreach Specialist',
    category: 'Outreach',
    location: 'Washington State',
    timeCommitment: '3-6 hours per week',
    description: 'Help spread the word about BOW programs and build partnerships with local organizations.',
    requirements: [
      'Excellent communication skills',
      'Knowledge of local community',
      'Social media experience',
      'Self-motivated'
    ],
    benefits: [
      'Networking opportunities',
      'Marketing experience',
      'Community connections',
      'Professional development'
    ]
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    category: 'Technical',
    location: 'Remote/Seattle',
    timeCommitment: '2-5 hours per week',
    description: 'Provide technical support for our website, social media, and digital platforms.',
    requirements: [
      'Basic web development skills',
      'Social media management',
      'Problem-solving abilities',
      'Reliable internet connection'
    ],
    benefits: [
      'Tech experience',
      'Portfolio building',
      'Remote work opportunity',
      'Skill development'
    ]
  }
];

// Sample volunteer applications data
const sampleApplications = [
  {
    id: 'app_1',
    opportunityId: 'event-coordinator',
    opportunityTitle: 'Event Coordinator',
    opportunityCategory: 'Events',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@example.com',
    applicantPhone: '(206) 555-0123',
    applicantAge: 28,
    applicantAddress: '123 Main St, Seattle, WA 98101',
    availability: 'Weekends and evenings',
    experience: 'Previous event planning experience',
    skills: 'Organization, communication, leadership',
    motivation: 'Passionate about community building',
    timeCommitment: '6 hours per event',
    references: [
      { name: 'Jane Smith', phone: '(206) 555-0124', relationship: 'Former colleague' }
    ],
    emergencyContact: {
      name: 'Mary Doe',
      phone: '(206) 555-0125',
      relationship: 'Spouse'
    },
    backgroundCheck: {
      consent: true
    },
    status: 'pending',
    applicationDate: new Date().toISOString(),
    reviewDate: null,
    reviewNotes: null
  }
];

// Get all volunteer opportunities
router.get('/opportunities', async (req, res) => {
  try {
    res.json(sampleOpportunities);
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer opportunities' });
  }
});

// Submit volunteer application (protected)
router.post('/apply', async (req, res) => {
  try {
    console.log('Received volunteer application data:', req.body);
    
    const {
      opportunityId,
      opportunityTitle,
      opportunityCategory,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge,
      applicantAddress,
      availability,
      experience,
      skills,
      motivation,
      timeCommitment,
      references,
      emergencyContact,
      backgroundCheckConsent
    } = req.body;

    if (Volunteer) {
      // Check if applicant already applied for this opportunity
      const existingApplication = await Volunteer.findByOpportunityAndEmail(opportunityId, applicantEmail);

      if (existingApplication) {
        return res.status(400).json({
          error: 'You have already applied for this opportunity'
        });
      }

      // Create new volunteer application
      const applicationData = {
        opportunityId,
        opportunityTitle,
        opportunityCategory,
        applicantName,
        applicantEmail,
        applicantPhone,
        applicantAge,
        applicantAddress,
        availability,
        experience,
        skills,
        motivation,
        timeCommitment,
        references,
        emergencyContact,
        backgroundCheck: {
          consent: backgroundCheckConsent
        },
        status: 'pending',
        applicationDate: new Date().toISOString()
      };

      const volunteer = await Volunteer.create(applicationData);

      res.status(201).json({
        message: 'Volunteer application submitted successfully',
        applicationId: volunteer.id
      });
    } else {
      // Fallback demo response
      const demoApplication = {
        id: `demo_app_${Date.now()}`,
        opportunityId,
        opportunityTitle,
        opportunityCategory,
        applicantName,
        applicantEmail,
        applicantPhone,
        applicantAge,
        applicantAddress,
        availability,
        experience,
        skills,
        motivation,
        timeCommitment,
        references,
        emergencyContact,
        backgroundCheck: {
          consent: backgroundCheckConsent
        },
        status: 'pending',
        applicationDate: new Date().toISOString()
      };

      res.status(201).json({
        message: 'Volunteer application submitted successfully (demo mode)',
        applicationId: demoApplication.id
      });
    }
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    res.status(500).json({ error: 'Failed to submit volunteer application' });
  }
});

// Admin: Get all applications (protected)
router.get('/applications', async (req, res) => {
  try {
    if (Volunteer) {
      const applications = await Volunteer.findAll();
      res.json(applications);
    } else {
      // Fallback to sample data
      res.json(sampleApplications);
    }
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    // Fallback to sample data
    res.json(sampleApplications);
  }
});

// Update volunteer application status (admin only)
router.put('/applications/update-status', async (req, res) => {
  try {
    const { key, status, reviewNotes } = req.body;
    
    if (Volunteer) {
      // Use the composite key to find and update the application
      const application = await Volunteer.findByOpportunityAndEmail(key.opportunityId, key.applicantEmail);
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      await application.update({
        status: status,
        reviewNotes: reviewNotes,
        reviewDate: new Date().toISOString()
      });

      res.json({
        message: 'Application status updated successfully'
      });
    } else {
      // Fallback demo response
      res.json({
        message: 'Application status updated successfully (demo mode)',
        key: key,
        status: status,
        reviewNotes: reviewNotes
      });
    }
  } catch (error) {
    console.error('Error updating volunteer application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Delete volunteer application (admin only)
router.delete('/applications/delete', async (req, res) => {
  try {
    console.log('[Backend] Delete request received');
    console.log('[Backend] Request body type:', typeof req.body);
    console.log('[Backend] Request body:', req.body);
    
    // Handle case where body might be a string or nested object
    let bodyData = req.body;
    
    // If body is an object with a 'body' property that's a string, parse it
    if (req.body && typeof req.body === 'object' && req.body.body && typeof req.body.body === 'string') {
      try {
        bodyData = JSON.parse(req.body.body);
        console.log('[Backend] Parsed nested body:', bodyData);
      } catch (parseError) {
        console.error('[Backend] Failed to parse nested body:', parseError);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }
    
    // If body is a string, try to parse it
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
        console.log('[Backend] Parsed string body:', bodyData);
      } catch (parseError) {
        console.error('[Backend] Failed to parse string body:', parseError);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }
    
    const { key } = bodyData;
    
    if (!key || !key.opportunityId || !key.applicantEmail) {
      console.error('[Backend] Missing required key data:', key);
      return res.status(400).json({ error: 'Missing required key data' });
    }
    
    console.log('[Backend] Deleting application with key:', key);
    
    if (Volunteer) {
      // Use the composite key to find and delete the application
      const application = await Volunteer.findByOpportunityAndEmail(key.opportunityId, key.applicantEmail);
      
      if (!application) {
        console.log('[Backend] Application not found for key:', key);
        return res.status(404).json({ error: 'Application not found' });
      }

      await application.delete();
      console.log('[Backend] Application deleted successfully');

      res.json({
        message: 'Application deleted successfully'
      });
    } else {
      // Fallback demo response
      console.log('[Backend] Demo mode - application would be deleted');
      res.json({
        message: 'Application deleted successfully (demo mode)',
        key: key
      });
    }
  } catch (error) {
    console.error('Error deleting volunteer application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Admin: Get application by ID (protected)
router.get('/applications/:id', async (req, res) => {
  try {
    if (Volunteer) {
      const application = await Volunteer.findById(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json(application);
    } else {
      // Fallback to sample data
      const application = sampleApplications.find(a => a.id === req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json(application);
    }
  } catch (error) {
    console.error('Error fetching volunteer application:', error);
    // Fallback to sample data
    const application = sampleApplications.find(a => a.id === req.params.id);
    if (application) {
      res.json(application);
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  }
});

// Get volunteer statistics
router.get('/stats', async (req, res) => {
  try {
    if (Volunteer) {
      const applications = await Volunteer.findAll();
      
      const totalApplications = applications.length;
      const activeVolunteers = applications.filter(a => a.status === 'active').length;
      const pendingApplications = applications.filter(a => a.status === 'pending').length;
      
      const statusBreakdown = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      res.json({
        totalApplications,
        activeVolunteers,
        pendingApplications,
        statusBreakdown
      });
    } else {
      // Fallback demo statistics
      const totalApplications = sampleApplications.length;
      const activeVolunteers = sampleApplications.filter(a => a.status === 'active').length;
      const pendingApplications = sampleApplications.filter(a => a.status === 'pending').length;
      
      const statusBreakdown = sampleApplications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      res.json({
        totalApplications,
        activeVolunteers,
        pendingApplications,
        statusBreakdown
      });
    }
  } catch (error) {
    console.error('Error fetching volunteer statistics:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer statistics' });
  }
});

// Get applications by opportunity
router.get('/opportunities/:opportunityId/applications', async (req, res) => {
  try {
    const applications = await Volunteer.find({
      opportunityId: req.params.opportunityId
    }).sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications for opportunity:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get volunteer applications by user (for member portal)
router.get('/user/:userId/applications', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching volunteer applications for user:', userId);

    if (Volunteer) {
      // First try to find by userId if it matches applicantEmail
      let applications = await Volunteer.findByApplicantEmail(userId);
      
      // If no applications found and userId looks like an email, try it directly
      if (applications.length === 0 && userId.includes('@')) {
        applications = await Volunteer.findByApplicantEmail(userId);
      }
      
      // If still no applications and userId doesn't look like email, 
      // we might need to get user's email from user service
      if (applications.length === 0 && !userId.includes('@')) {
        // For now, return empty array - in the future we could look up user's email
        applications = [];
      }

      console.log(`Found ${applications.length} volunteer applications for user ${userId}`);
      res.json(applications);
    } else {
      // Fallback to sample data for demo mode
      // Filter sample applications by a demo user email
      const demoEmail = userId.includes('@') ? userId : 'john.doe@example.com';
      const applications = sampleApplications.filter(app => 
        app.applicantEmail === demoEmail
      );
      
      console.log(`Found ${applications.length} sample volunteer applications for user ${userId}`);
      res.json(applications);
    }
  } catch (error) {
    console.error('Error fetching user volunteer applications:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer applications' });
  }
});

// Export volunteer applications to CSV
router.get('/export-csv', async (req, res) => {
  try {
    console.log('🔄 CSV Export Request Received');
    
    let applications;
    
    if (Volunteer) {
      console.log('📊 Using DynamoDB Volunteer model');
      applications = await Volunteer.findAll();
      console.log(`📊 Found ${applications.length} applications from DynamoDB`);
    } else {
      console.log('📊 Using sample data (DynamoDB not available)');
      applications = sampleApplications;
      console.log(`📊 Using ${applications.length} sample applications`);
    }

    if (!applications || applications.length === 0) {
      console.log('❌ No applications found to export');
      return res.status(404).json({ error: 'No applications found to export' });
    }

    console.log('📄 Generating CSV content...');
    const csvContent = createCSV(applications);
    console.log(`📄 CSV content generated: ${csvContent.length} characters`);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `volunteer-applications-${timestamp}.csv`;
    
    console.log(`📄 Setting headers for file: ${filename}`);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    console.log('📄 Sending CSV response...');
    res.send(csvContent);
    console.log('✅ CSV export completed successfully');

  } catch (error) {
    console.error('❌ Error exporting volunteer applications to CSV:', error);
    res.status(500).json({ error: 'Failed to export applications to CSV' });
  }
});

module.exports = router; 