const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { docClient, TABLES } = require('../config/dynamodb');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const router = express.Router();

// Get all sponsors
router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: TABLES.SPONSORS,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': 'true'
      }
    };

    const result = await docClient.send(new ScanCommand(params));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// Get all sponsors (admin - including inactive)
router.get('/admin', async (req, res) => {
  try {
    const params = {
      TableName: TABLES.SPONSORS
    };

    const result = await docClient.send(new ScanCommand(params));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching sponsors for admin:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// Get sponsor by ID
router.get('/:id', async (req, res) => {
  try {
    const params = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: req.params.id
      }
    };

    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ error: 'Failed to fetch sponsor' });
  }
});

// Create new sponsor
router.post('/', async (req, res) => {
  try {
    const { name, logoUrl, website, description, isActive = 'true' } = req.body;

    if (!logoUrl) {
      return res.status(400).json({ error: 'Logo URL is required' });
    }

    // Generate a name from logo URL if not provided
    const generateNameFromUrl = (url) => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop();
        const nameWithoutExt = filename.split('.')[0];
        return nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
      } catch {
        return 'Sponsor';
      }
    };

    const sponsor = {
      id: uuidv4(),
      name: name || generateNameFromUrl(logoUrl),
      logoUrl,
      website: website || '#',
      description: description || '',
      isActive: isActive.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLES.SPONSORS,
      Item: sponsor
    };

    await docClient.send(new PutCommand(params));
    res.status(201).json(sponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

// Update sponsor
router.put('/:id', async (req, res) => {
  try {
    const { name, logoUrl, website, description, isActive } = req.body;

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (name !== undefined) {
      updateExpression.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (logoUrl !== undefined) {
      updateExpression.push('logoUrl = :logoUrl');
      expressionAttributeValues[':logoUrl'] = logoUrl;
    }

    if (website !== undefined) {
      updateExpression.push('website = :website');
      expressionAttributeValues[':website'] = website;
    }

    if (description !== undefined) {
      updateExpression.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = description;
    }

    if (isActive !== undefined) {
      updateExpression.push('isActive = :isActive');
      expressionAttributeValues[':isActive'] = isActive.toString();
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: req.params.id
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

// Delete sponsor
router.delete('/:id', async (req, res) => {
  try {
    const params = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: req.params.id
      }
    };

    await docClient.send(new DeleteCommand(params));
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

// Toggle sponsor active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const params = {
      TableName: TABLES.SPONSORS,
      Key: {
        id: req.params.id
      },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': req.body.isActive.toString(),
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error toggling sponsor status:', error);
    res.status(500).json({ error: 'Failed to toggle sponsor status' });
  }
});

module.exports = router;
