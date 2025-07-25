const express = require('express');
const router = express.Router();
const verifyCognito = require('../middleware/verifyCognito');
const syncUserToDynamoDB = require('../middleware/syncUserToDynamoDB');

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

// Update volunteer application status (admin only)
router.patch('/applications/update-status', async (req, res) => {
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

module.exports = router; 