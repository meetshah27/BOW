const express = require('express');
const router = express.Router();
const VolunteerOpportunity = require('../models-dynamodb/VolunteerOpportunity');

// GET - Get all volunteer opportunities (for admin panel)
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.getAllOpportunities();
    
    res.status(200).json({
      opportunities: opportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ 
      message: 'Failed to get volunteer opportunities',
      error: error.message 
    });
  }
});

// GET - Get active volunteer opportunities (for public page)
router.get('/opportunities/active', async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.getActiveOpportunities();
    
    res.status(200).json({
      opportunities: opportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get active opportunities error:', error);
    res.status(500).json({ 
      message: 'Failed to get active volunteer opportunities',
      error: error.message 
    });
  }
});

// GET - Get opportunity by ID
router.get('/opportunities/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    res.status(200).json({ opportunity });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ 
      message: 'Failed to get opportunity',
      error: error.message 
    });
  }
});

// POST - Create new volunteer opportunity
router.post('/opportunities', async (req, res) => {
  try {
    const { title, category, location, timeCommitment, description, requirements, benefits, maxVolunteers } = req.body;
    
    // Validate required fields
    if (!title || !category || !location || !timeCommitment || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, category, location, timeCommitment, description' 
      });
    }

    const opportunityData = {
      title,
      category,
      location,
      timeCommitment,
      description,
      requirements: requirements || [],
      benefits: benefits || [],
      maxVolunteers: maxVolunteers || null
    };

    const opportunity = await VolunteerOpportunity.create(opportunityData);
    
    res.status(201).json({
      message: 'Volunteer opportunity created successfully',
      opportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ 
      message: 'Failed to create volunteer opportunity',
      error: error.message 
    });
  }
});

// PUT - Update volunteer opportunity
router.put('/opportunities/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const updateData = req.body;
    
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const updated = await VolunteerOpportunity.updateOpportunity(opportunityId, updateData);
    
    res.status(200).json({
      message: 'Opportunity updated successfully',
      opportunity: updated
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ 
      message: 'Failed to update opportunity',
      error: error.message 
    });
  }
});

// DELETE - Delete volunteer opportunity
router.delete('/opportunities/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    await VolunteerOpportunity.deleteOpportunity(opportunityId);
    
    res.status(200).json({
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ 
      message: 'Failed to delete opportunity',
      error: error.message 
    });
  }
});

// PATCH - Toggle opportunity active status
router.patch('/opportunities/:opportunityId/toggle', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const updated = await VolunteerOpportunity.toggleActive(opportunityId);
    
    res.status(200).json({
      message: `Opportunity ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      opportunity: updated
    });
  } catch (error) {
    console.error('Toggle opportunity error:', error);
    res.status(500).json({ 
      message: 'Failed to toggle opportunity status',
      error: error.message 
    });
  }
});

// GET - Get opportunity statistics
router.get('/opportunities/stats/overview', async (req, res) => {
  try {
    const stats = await VolunteerOpportunity.getOpportunityStats();
    
    res.status(200).json({
      stats,
      message: `Opportunity statistics: ${stats.total} total, ${stats.active} active, ${stats.inactive} inactive`
    });
  } catch (error) {
    console.error('Get opportunity stats error:', error);
    res.status(500).json({ 
      message: 'Failed to get opportunity statistics',
      error: error.message 
    });
  }
});

// GET - Get opportunities by category
router.get('/opportunities/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const opportunities = await VolunteerOpportunity.getOpportunitiesByCategory(category);
    
    res.status(200).json({
      category,
      opportunities: opportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get opportunities by category error:', error);
    res.status(500).json({ 
      message: 'Failed to get opportunities by category',
      error: error.message 
    });
  }
});

module.exports = router; 