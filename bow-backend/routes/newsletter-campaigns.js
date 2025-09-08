const express = require('express');
const router = express.Router();
const NewsletterCampaign = require('../models-dynamodb/NewsletterCampaign');
const Newsletter = require('../models-dynamodb/Newsletter');
const { EmailService } = require('../config/ses');

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

// POST - Send campaign to subscribers
router.post('/campaigns/:campaignId/send', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status === 'sent') {
      return res.status(400).json({ message: 'Campaign has already been sent' });
    }

    // Get subscribers based on target audience
    let subscribers;
    if (campaign.targetAudience === 'all') {
      subscribers = await Newsletter.getActiveSubscribers();
    } else {
      // If targeting specific preferences, get subscribers by preference
      subscribers = await Newsletter.getSubscribersByPreference(campaign.targetAudience);
    }

    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found for target audience' });
    }

    console.log(`📧 Sending campaign "${campaign.title}" to ${subscribers.length} subscribers...`);

    // Prepare email content
    const htmlContent = EmailService.getNewsletterTemplate(campaign.content, campaign.title);
    
    // Send newsletter to all subscribers
    const emailResults = await EmailService.sendNewsletter({
      subscribers,
      subject: campaign.subject,
      htmlContent,
      textContent: null // Will be auto-generated from HTML
    });

    // Mark campaign as sent
    const sent = await NewsletterCampaign.markAsSent(campaignId);
    
    res.status(200).json({
      message: `Campaign sent successfully to ${emailResults.successful} subscribers`,
      campaign: sent,
      emailResults: {
        total: emailResults.total,
        successful: emailResults.successful,
        failed: emailResults.failed
      }
    });
  } catch (error) {
    console.error('Send campaign error:', error);
    res.status(500).json({ 
      message: 'Failed to send campaign',
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

// POST - Send test email for campaign preview
router.post('/campaigns/:campaignId/test', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ message: 'Test email address is required' });
    }

    const campaign = await NewsletterCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Prepare test email content
    const htmlContent = EmailService.getNewsletterTemplate(campaign.content, campaign.title);
    const subject = `[TEST] ${campaign.subject}`;
    
    // Send test email
    await EmailService.sendEmail({
      to: testEmail,
      subject,
      htmlContent
    });

    res.status(200).json({
      message: `Test email sent successfully to ${testEmail}`
    });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({ 
      message: 'Failed to send test email',
      error: error.message 
    });
  }
});

// GET - Get SES verified email addresses
router.get('/ses/verified-emails', async (req, res) => {
  try {
    const verifiedEmails = await EmailService.getVerifiedEmails();
    
    res.status(200).json({
      verifiedEmails,
      count: verifiedEmails.length,
      message: `${verifiedEmails.length} verified email addresses found`
    });
  } catch (error) {
    console.error('Get verified emails error:', error);
    res.status(500).json({ 
      message: 'Failed to get verified emails',
      error: error.message 
    });
  }
});

// POST - Verify email address with SES
router.post('/ses/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const result = await EmailService.verifyEmailAddress(email);
    
    res.status(200).json({
      message: `Verification email sent to ${email}. Please check your inbox and click the verification link.`,
      result
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      message: 'Failed to initiate email verification',
      error: error.message 
    });
  }
});

module.exports = router; 