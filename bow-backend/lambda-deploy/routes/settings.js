const express = require('express');
const router = express.Router();
const Settings = require('../models-dynamodb/Settings');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      settings: {
        membershipApplicationEnabled: settings.membershipApplicationEnabled,
        vendorApplicationEnabled: settings.vendorApplicationEnabled,
        performerApplicationEnabled: settings.performerApplicationEnabled,
        campaignProgressBarEnabled: settings.campaignProgressBarEnabled,
        campaignTitle: settings.campaignTitle,
        campaignDescription: settings.campaignDescription,
        campaignGoal: settings.campaignGoal,
        campaignRaised: settings.campaignRaised,
        lastUpdated: settings.lastUpdated,
        updatedBy: settings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch settings',
      message: error.message
    });
  }
});

// Get specific setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const settings = await Settings.getSettings();

    if (!settings.hasOwnProperty(key)) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }

    res.json({
      success: true,
      key: key,
      value: settings[key]
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch setting',
      message: error.message
    });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { updates, updatedBy } = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid updates provided'
      });
    }

    // Get current settings
    const settings = await Settings.getSettings();
    
    // Prepare update object
    const updateData = { ...updates };
    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    // Update settings in DynamoDB
    await settings.update(updateData);

    // Refresh settings to get updated values
    const updatedSettings = await Settings.getSettings();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        membershipApplicationEnabled: updatedSettings.membershipApplicationEnabled,
        vendorApplicationEnabled: updatedSettings.vendorApplicationEnabled,
        performerApplicationEnabled: updatedSettings.performerApplicationEnabled,
        campaignProgressBarEnabled: updatedSettings.campaignProgressBarEnabled,
        campaignTitle: updatedSettings.campaignTitle,
        campaignDescription: updatedSettings.campaignDescription,
        campaignGoal: updatedSettings.campaignGoal,
        campaignRaised: updatedSettings.campaignRaised,
        lastUpdated: updatedSettings.lastUpdated,
        updatedBy: updatedSettings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      message: error.message
    });
  }
});

// Toggle membership application specifically
router.put('/membership-application', async (req, res) => {
  try {
    const { enabled, updatedBy } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid enabled value. Must be boolean.'
      });
    }

    // Get current settings
    const settings = await Settings.getSettings();
    
    // Update membership application setting
    await settings.update({
      membershipApplicationEnabled: enabled,
      updatedBy: updatedBy || 'unknown'
    });

    // Refresh settings to get updated values
    const updatedSettings = await Settings.getSettings();

    res.json({
      success: true,
      message: `Membership application ${enabled ? 'enabled' : 'disabled'} successfully`,                                                                       
      settings: {
        membershipApplicationEnabled: updatedSettings.membershipApplicationEnabled,    
        vendorApplicationEnabled: updatedSettings.vendorApplicationEnabled,
        performerApplicationEnabled: updatedSettings.performerApplicationEnabled,
        campaignProgressBarEnabled: updatedSettings.campaignProgressBarEnabled,
        campaignTitle: updatedSettings.campaignTitle,
        campaignDescription: updatedSettings.campaignDescription,
        campaignGoal: updatedSettings.campaignGoal,
        campaignRaised: updatedSettings.campaignRaised,
        lastUpdated: updatedSettings.lastUpdated,
        updatedBy: updatedSettings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error toggling membership application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle membership application',
      message: error.message
    });
  }
});

// Toggle vendor application specifically
router.put('/vendor-application', async (req, res) => {
  try {
    const { enabled, updatedBy } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Invalid enabled value. Must be boolean.'
      });
    }

    const settings = await Settings.getSettings();
    await settings.update({
      vendorApplicationEnabled: enabled,
      updatedBy: updatedBy || 'unknown'
    });

    const updatedSettings = await Settings.getSettings();
    return res.json({
      success: true,
      message: `Vendor application ${enabled ? 'enabled' : 'disabled'} successfully`,
      settings: {
        membershipApplicationEnabled: updatedSettings.membershipApplicationEnabled,
        vendorApplicationEnabled: updatedSettings.vendorApplicationEnabled,
        performerApplicationEnabled: updatedSettings.performerApplicationEnabled,
        campaignProgressBarEnabled: updatedSettings.campaignProgressBarEnabled,
        campaignTitle: updatedSettings.campaignTitle,
        campaignDescription: updatedSettings.campaignDescription,
        campaignGoal: updatedSettings.campaignGoal,
        campaignRaised: updatedSettings.campaignRaised,
        lastUpdated: updatedSettings.lastUpdated,
        updatedBy: updatedSettings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error toggling vendor application:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle vendor application',
      message: error.message
    });
  }
});

// Toggle performer application specifically
router.put('/performer-application', async (req, res) => {
  try {
    const { enabled, updatedBy } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Invalid enabled value. Must be boolean.'
      });
    }

    const settings = await Settings.getSettings();
    await settings.update({
      performerApplicationEnabled: enabled,
      updatedBy: updatedBy || 'unknown'
    });

    const updatedSettings = await Settings.getSettings();
    return res.json({
      success: true,
      message: `Performer application ${enabled ? 'enabled' : 'disabled'} successfully`,
      settings: {
        membershipApplicationEnabled: updatedSettings.membershipApplicationEnabled,
        vendorApplicationEnabled: updatedSettings.vendorApplicationEnabled,
        performerApplicationEnabled: updatedSettings.performerApplicationEnabled,
        campaignProgressBarEnabled: updatedSettings.campaignProgressBarEnabled,
        campaignTitle: updatedSettings.campaignTitle,
        campaignDescription: updatedSettings.campaignDescription,
        campaignGoal: updatedSettings.campaignGoal,
        campaignRaised: updatedSettings.campaignRaised,
        lastUpdated: updatedSettings.lastUpdated,
        updatedBy: updatedSettings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error toggling performer application:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle performer application',
      message: error.message
    });
  }
});

// Toggle campaign progress bar specifically and update details
router.put('/campaign-progress-bar', async (req, res) => {
  try {
    const { enabled, title, description, goal, raised, updatedBy } = req.body;

    if (enabled !== undefined && typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Invalid enabled value. Must be boolean.'
      });
    }

    const settings = await Settings.getSettings();
    const updatePayload = { updatedBy: updatedBy || 'unknown' };
    
    if (enabled !== undefined) updatePayload.campaignProgressBarEnabled = enabled;
    if (title !== undefined) updatePayload.campaignTitle = title;
    if (description !== undefined) updatePayload.campaignDescription = description;
    if (goal !== undefined) updatePayload.campaignGoal = Number(goal);
    if (raised !== undefined) updatePayload.campaignRaised = Number(raised);

    await settings.update(updatePayload);

    const updatedSettings = await Settings.getSettings();
    return res.json({
      success: true,
      message: `Campaign Progress Bar updated successfully`,
      settings: {
        membershipApplicationEnabled: updatedSettings.membershipApplicationEnabled,
        vendorApplicationEnabled: updatedSettings.vendorApplicationEnabled,
        performerApplicationEnabled: updatedSettings.performerApplicationEnabled,
        campaignProgressBarEnabled: updatedSettings.campaignProgressBarEnabled,
        campaignTitle: updatedSettings.campaignTitle,
        campaignDescription: updatedSettings.campaignDescription,
        campaignGoal: updatedSettings.campaignGoal,
        campaignRaised: updatedSettings.campaignRaised,
        lastUpdated: updatedSettings.lastUpdated,
        updatedBy: updatedSettings.updatedBy
      }
    });
  } catch (error) {
    console.error('Error toggling campaign progress bar:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle campaign progress bar',
      message: error.message
    });
  }
});

module.exports = router;
