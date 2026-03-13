const express = require('express');
const router = express.Router();

const PerformerApplication = require('../models-dynamodb/PerformerApplication');

router.post('/applications', async (req, res) => {
  try {
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      actName,
      performanceType,
      genre,
      website,
      socialLinks,
      experience,
      availabilityNotes,
      notes,
    } = req.body || {};

    if (!applicantName || !applicantEmail) {
      return res.status(400).json({
        error: 'Missing required fields. applicantName and applicantEmail are required.',
      });
    }

    const created = await PerformerApplication.create({
      applicantName,
      applicantEmail,
      applicantPhone,
      actName,
      performanceType,
      genre,
      website,
      socialLinks,
      experience,
      availabilityNotes,
      notes,
    });

    return res.status(201).json({
      message: 'Performer application submitted successfully!',
      applicationId: created.id,
      status: created.status,
    });
  } catch (error) {
    console.error('Error submitting performer application:', error);
    return res.status(500).json({
      error: 'Failed to submit performer application',
      message: error.message,
    });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const applications = await PerformerApplication.findAll();
    const sorted = applications.sort(
      (a, b) => new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0)
    );
    return res.json(sorted);
  } catch (error) {
    console.error('Error fetching performer applications:', error);
    return res.status(500).json({
      error: 'Failed to fetch performer applications',
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

    const updated = await PerformerApplication.updateStatusByKey(applicantEmail, id, {
      status,
      reviewNotes,
    });

    return res.json({
      message: 'Performer application status updated successfully',
      application: updated,
    });
  } catch (error) {
    console.error('Error updating performer application status:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update performer application status', message: error.message });
  }
});

router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const applicantEmail = req.query.applicantEmail || req.body?.applicantEmail;
    await PerformerApplication.deleteByKey(applicantEmail, id);
    return res.json({ message: 'Performer application deleted successfully' });
  } catch (error) {
    console.error('Error deleting performer application:', error);
    return res.status(500).json({ error: 'Failed to delete performer application', message: error.message });
  }
});

module.exports = router;

