const express = require('express');
const router = express.Router();

const VendorApplication = require('../models-dynamodb/VendorApplication');

router.post('/applications', async (req, res) => {
  try {
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      businessName,
      businessType,
      website,
      socialLinks,
      productsDescription,
      notes,
    } = req.body || {};

    if (!applicantName || !applicantEmail) {
      return res.status(400).json({
        error: 'Missing required fields. applicantName and applicantEmail are required.',
      });
    }

    const created = await VendorApplication.create({
      applicantName,
      applicantEmail,
      applicantPhone,
      businessName,
      businessType,
      website,
      socialLinks,
      productsDescription,
      notes,
    });

    return res.status(201).json({
      message: 'Vendor application submitted successfully!',
      applicationId: created.id,
      status: created.status,
    });
  } catch (error) {
    console.error('Error submitting vendor application:', error);
    return res.status(500).json({
      error: 'Failed to submit vendor application',
      message: error.message,
    });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const applications = await VendorApplication.findAll();
    const sorted = applications.sort(
      (a, b) => new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0)
    );
    return res.json(sorted);
  } catch (error) {
    console.error('Error fetching vendor applications:', error);
    return res.status(500).json({
      error: 'Failed to fetch vendor applications',
      message: error.message,
    });
  }
});

router.put('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { applicantEmail, status, reviewNotes } = req.body || {};

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const updated = await VendorApplication.updateStatusByKey(applicantEmail, id, {
      status,
      reviewNotes,
    });

    return res.json({
      message: 'Vendor application status updated successfully',
      application: updated,
    });
  } catch (error) {
    console.error('Error updating vendor application status:', error);
    return res.status(500).json({ error: 'Failed to update vendor application status', message: error.message });
  }
});

router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const applicantEmail = req.query.applicantEmail || req.body?.applicantEmail;
    await VendorApplication.deleteByKey(applicantEmail, id);
    return res.json({ message: 'Vendor application deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor application:', error);
    return res.status(500).json({ error: 'Failed to delete vendor application', message: error.message });
  }
});

module.exports = router;

