const express = require('express');
const router = express.Router();
const NewsletterCampaign = require('../models-dynamodb/NewsletterCampaign');

// POST - Create new newsletter campaign
router.post('/campaigns', async (req, res) => {
  try {
    const { title, subject, content, author, targetAudience, template, scheduledDate } = req.body;
    
    // Validate required fields
    if (!title || !subject || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, subject, content' 
      });
    }

    const campaignData = {
      title,
      subject,
      content,
      author: author || 'Admin',
      targetAudience: targetAudience || 'all',
      template: template || 'default',
      scheduledDate: scheduledDate || null
    };

    const campaign = await NewsletterCampaign.create(campaignData);
    
    res.status(201).json({
      message: 'Newsletter campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Newsletter campaign creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create newsletter campaign',
      error: error.message 
    });
  }
});

// GET - Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.getAllCampaigns();
    
    res.status(200).json({
      campaigns: campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ 
      message: 'Failed to get campaigns',
      error: error.message 
    });
  }
});

// GET - Get campaign by ID
router.get('/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json({ campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ 
      message: 'Failed to get campaign',
      error: error.message 
    });
  }
});

// GET - Get campaigns by status
router.get('/campaigns/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['draft', 'scheduled', 'sent'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: draft, scheduled, sent' 
      });
    }

    const campaigns = await NewsletterCampaign.getCampaignsByStatus(status);
    
    res.status(200).json({
      status,
      campaigns: campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get campaigns by status error:', error);
    res.status(500).json({ 
      message: 'Failed to get campaigns by status',
      error: error.message 
    });
  }
});

// PUT - Update campaign
router.put('/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updateData = req.body;
    
    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const updated = await NewsletterCampaign.updateCampaign(campaignId, updateData);
    
    res.status(200).json({
      message: 'Campaign updated successfully',
      campaign: updated
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ 
      message: 'Failed to update campaign',
      error: error.message 
    });
  }
});

// DELETE - Delete campaign
router.delete('/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await NewsletterCampaign.deleteCampaign(campaignId);
    
    res.status(200).json({
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ 
      message: 'Failed to delete campaign',
      error: error.message 
    });
  }
});

// POST - Schedule campaign
router.post('/campaigns/:campaignId/schedule', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { scheduledDate } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required' });
    }

    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const scheduled = await NewsletterCampaign.scheduleCampaign(campaignId, scheduledDate);
    
    res.status(200).json({
      message: 'Campaign scheduled successfully',
      campaign: scheduled
    });
  } catch (error) {
    console.error('Schedule campaign error:', error);
    res.status(500).json({ 
      message: 'Failed to schedule campaign',
      error: error.message 
    });
  }
});

// POST - Mark campaign as sent
router.post('/campaigns/:campaignId/send', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const sent = await NewsletterCampaign.markAsSent(campaignId);
    
    res.status(200).json({
      message: 'Campaign marked as sent successfully',
      campaign: sent
    });
  } catch (error) {
    console.error('Mark campaign as sent error:', error);
    res.status(500).json({ 
      message: 'Failed to mark campaign as sent',
      error: error.message 
    });
  }
});

// GET - Get campaign statistics
router.get('/campaigns/stats/overview', async (req, res) => {
  try {
    const stats = await NewsletterCampaign.getCampaignStats();
    
    res.status(200).json({
      stats,
      message: `Campaign statistics: ${stats.total} total, ${stats.draft} drafts, ${stats.scheduled} scheduled, ${stats.sent} sent`
    });
  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({ 
      message: 'Failed to get campaign statistics',
      error: error.message 
    });
  }
});

// GET - Get scheduled campaigns ready to send
router.get('/campaigns/scheduled/ready', async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.getScheduledCampaigns();
    
    res.status(200).json({
      campaigns,
      count: campaigns.length,
      message: `${campaigns.length} campaigns ready to send`
    });
  } catch (error) {
    console.error('Get scheduled campaigns error:', error);
    res.status(500).json({ 
      message: 'Failed to get scheduled campaigns',
      error: error.message 
    });
  }
});

module.exports = router; 