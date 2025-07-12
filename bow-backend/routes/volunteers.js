const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// Get all volunteer opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = [
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

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer opportunities' });
  }
});

// Submit volunteer application
router.post('/apply', async (req, res) => {
  try {
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

    // Check if applicant already applied for this opportunity
    const existingApplication = await Volunteer.findOne({
      opportunityId,
      applicantEmail
    });

    if (existingApplication) {
      return res.status(400).json({
        error: 'You have already applied for this opportunity'
      });
    }

    // Create new volunteer application
    const volunteer = new Volunteer({
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
      }
    });

    await volunteer.save();

    res.status(201).json({
      message: 'Volunteer application submitted successfully',
      applicationId: volunteer._id
    });
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    res.status(500).json({ error: 'Failed to submit volunteer application' });
  }
});

// Get all volunteer applications (admin only)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Volunteer.find()
      .sort({ applicationDate: -1 })
      .select('-__v');

    res.json(applications);
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer applications' });
  }
});

// Get volunteer application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Volunteer.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching volunteer application:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer application' });
  }
});

// Update volunteer application status (admin only)
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    const application = await Volunteer.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    if (reviewNotes) {
      application.reviewNotes = reviewNotes;
    }
    application.reviewDate = new Date();

    await application.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating volunteer application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get volunteer statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Volunteer.countDocuments();
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
    const pendingApplications = await Volunteer.countDocuments({ status: 'pending' });

    res.json({
      totalApplications,
      activeVolunteers,
      pendingApplications,
      statusBreakdown: stats
    });
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