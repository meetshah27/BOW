const express = require('express');
const router = express.Router();
const Membership = require('../models-dynamodb/Membership');

// Fallback sample data for when DynamoDB is not available
const sampleMembershipApplications = [
  {
    id: 'mem_1',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@example.com',
    applicantPhone: '(206) 555-0123',
    applicantAge: '26-35',
    applicantGender: 'Male',
    experience: 'YES',
    interest: 'DHOL',
    socialMediaFollowed: 'YES',
    status: 'pending',
    applicationDate: new Date().toISOString(),
    reviewDate: null,
    reviewNotes: null
  },
  {
    id: 'mem_2',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane.smith@example.com',
    applicantPhone: '(206) 555-0124',
    applicantAge: '18-25',
    applicantGender: 'Female',
    experience: 'NO',
    interest: 'Dance/Flashmob/Garba/Dandiya/',
    socialMediaFollowed: 'YES',
    status: 'approved',
    applicationDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reviewDate: new Date().toISOString(),
    reviewNotes: 'Great candidate, approved for membership'
  }
];

// Submit membership application
router.post('/applications', async (req, res) => {
  try {
    console.log('Received membership application data:', req.body);
    
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge,
      applicantGender,
      experience,
      interest,
      socialMediaFollowed
    } = req.body;

    // Validate required fields
    if (!applicantName || !applicantEmail || !applicantPhone || !applicantAge || !experience || !interest || !socialMediaFollowed) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please fill in all required fields.' 
      });
    }

    try {
      // Try to use database first
      const newApplication = await Membership.create({
        applicantName,
        applicantEmail,
        applicantPhone,
        applicantAge,
        applicantGender,
        experience,
        interest,
        socialMediaFollowed
      });

      res.status(201).json({
        message: 'Membership application submitted successfully!',
        applicationId: newApplication.id,
        status: 'pending'
      });
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      
      // Fallback to sample data if database is not available
      const existingApplication = sampleMembershipApplications.find(app => 
        app.applicantEmail.toLowerCase() === applicantEmail.toLowerCase()
      );

      if (existingApplication) {
        return res.status(400).json({ 
          error: 'You have already submitted a membership application. Please wait for review.' 
        });
      }

      const newApplication = {
        id: `mem_${Date.now()}`,
        applicantName,
        applicantEmail,
        applicantPhone,
        applicantAge,
        applicantGender,
        experience,
        interest,
        socialMediaFollowed,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        reviewDate: null,
        reviewNotes: null
      };

      sampleMembershipApplications.push(newApplication);

      res.status(201).json({
        message: 'Membership application submitted successfully! (demo mode)',
        applicationId: newApplication.id,
        status: 'pending'
      });
    }

  } catch (error) {
    console.error('Error submitting membership application:', error);
    res.status(500).json({ error: 'Failed to submit membership application' });
  }
});

// Admin: Get all membership applications
router.get('/applications', async (req, res) => {
  try {
    try {
      // Try to use database first
      const applications = await Membership.findAll();
      // Sort by application date (newest first)
      const sortedApplications = applications.sort((a, b) => 
        new Date(b.applicationDate) - new Date(a.applicationDate)
      );
      res.json(sortedApplications);
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      // Fallback to sample data
      const sortedApplications = [...sampleMembershipApplications].sort((a, b) => 
        new Date(b.applicationDate) - new Date(a.applicationDate)
      );
      res.json(sortedApplications);
    }
  } catch (error) {
    console.error('Error fetching membership applications:', error);
    res.status(500).json({ error: 'Failed to fetch membership applications' });
  }
});

// Admin: Update membership application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    try {
      // Try to use database first
      const updatedApplication = await Membership.updateById(id, {
        status,
        reviewNotes,
        reviewDate: new Date().toISOString()
      });

      res.json({
        message: 'Application status updated successfully',
        application: updatedApplication
      });
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      
      // Fallback to sample data
      const applicationIndex = sampleMembershipApplications.findIndex(app => app.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Update application
      sampleMembershipApplications[applicationIndex] = {
        ...sampleMembershipApplications[applicationIndex],
        status,
        reviewNotes,
        reviewDate: new Date().toISOString()
      };

      res.json({
        message: 'Application status updated successfully (demo mode)',
        application: sampleMembershipApplications[applicationIndex]
      });
    }

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Admin: Delete membership application
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try to use database first
      const application = await Membership.findById(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      await Membership.deleteById(id);

      res.json({
        message: 'Application deleted successfully',
        application: application
      });
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      
      // Fallback to sample data
      const applicationIndex = sampleMembershipApplications.findIndex(app => app.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const deletedApplication = sampleMembershipApplications.splice(applicationIndex, 1)[0];

      res.json({
        message: 'Application deleted successfully (demo mode)',
        application: deletedApplication
      });
    }

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Get membership application statistics
router.get('/stats', async (req, res) => {
  try {
    try {
      // Try to use database first
      const stats = await Membership.getStats();
      res.json(stats);
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      
      // Fallback to sample data
      const totalApplications = sampleMembershipApplications.length;
      const pendingApplications = sampleMembershipApplications.filter(app => app.status === 'pending').length;
      const approvedApplications = sampleMembershipApplications.filter(app => app.status === 'approved').length;
      const rejectedApplications = sampleMembershipApplications.filter(app => app.status === 'rejected').length;

      res.json({
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications
      });
    }
  } catch (error) {
    console.error('Error fetching membership stats:', error);
    res.status(500).json({ error: 'Failed to fetch membership statistics' });
  }
});

module.exports = router;
