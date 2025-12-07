const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class EventAddon {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.eventId = data.eventId; // Required: links to event
    this.name = data.name; // Required: e.g., "Gul-Tilachi Poli"
    this.price = data.price || 0; // Price in dollars (e.g., 5.00)
    this.description = data.description || ''; // Description text
    this.stock = data.stock || null; // null = unlimited, number = limited stock
    this.availableStock = data.availableStock || data.stock || null; // Current available stock
    this.isFreeWithTicket = data.isFreeWithTicket || false; // If true, included free with ticket purchase
    this.freeQuantityPerTicket = data.freeQuantityPerTicket || 0; // How many free items per ticket (e.g., 1)
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.displayOrder = data.displayOrder || 0; // For ordering items in display
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new event addon
  static async create(addonData) {
    const addon = new EventAddon(addonData);
    const tableName = TABLES.EVENT_ADDONS || 'bow-event-addons';
    console.log('[EventAddon.create] Table name:', tableName);
    console.log('[EventAddon.create] Addon data:', JSON.stringify(addon, null, 2));
    
    const command = new PutCommand({
      TableName: tableName,
      Item: addon
    });

    try {
      await docClient.send(command);
      console.log('[EventAddon.create] Successfully created addon:', addon.id);
      return addon;
    } catch (error) {
      console.error('[EventAddon.create] Error creating event addon:', error);
      console.error('[EventAddon.create] Error message:', error.message);
      console.error('[EventAddon.create] Error code:', error.code);
      console.error('[EventAddon.create] Error name:', error.name);
      throw error;
    }
  }

  // Get addon by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.EVENT_ADDONS || 'EventAddons',
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new EventAddon(result.Item) : null;
    } catch (error) {
      console.error('Error finding addon by ID:', error);
      throw error;
    }
  }

  // Get all addons for an event
  static async findByEventId(eventId) {
    const command = new QueryCommand({
      TableName: TABLES.EVENT_ADDONS || 'EventAddons',
      IndexName: 'eventId-index', // You'll need to create this GSI
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: {
        ':eventId': eventId
      },
      FilterExpression: '#isActive = :isActive',
      ExpressionAttributeNames: {
        '#isActive': 'isActive'
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new EventAddon(item)).sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      // Fallback to scan if index doesn't exist
      console.log('Index not found, using scan fallback');
      const scanCommand = new ScanCommand({
        TableName: TABLES.EVENT_ADDONS || 'EventAddons',
        FilterExpression: 'eventId = :eventId AND #isActive = :isActive',
        ExpressionAttributeValues: {
          ':eventId': eventId,
          ':isActive': true
        },
        ExpressionAttributeNames: {
          '#isActive': 'isActive'
        }
      });
      const scanResult = await docClient.send(scanCommand);
      return scanResult.Items.map(item => new EventAddon(item)).sort((a, b) => a.displayOrder - b.displayOrder);
    }
  }

  // Update addon
  async update(updateData) {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('No update data provided');
    }
    
    if (!this.id) {
      throw new Error('Addon ID is missing. Cannot update addon without ID.');
    }
    
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    let updatingUpdatedAt = false;
    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
        if (key === 'updatedAt') updatingUpdatedAt = true;
      }
    });

    if (!updatingUpdatedAt) {
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    }
    
    const command = new UpdateCommand({
      TableName: TABLES.EVENT_ADDONS || 'EventAddons',
      Key: { id: this.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error updating addon:', error);
      throw error;
    }
  }

  // Decrement stock when item is purchased
  async decrementStock(quantity = 1) {
    if (this.stock === null) {
      return this; // Unlimited stock
    }
    
    if (this.availableStock === null) {
      this.availableStock = this.stock;
    }
    
    if (this.availableStock < quantity) {
      throw new Error('Insufficient stock available');
    }
    
    const newStock = this.availableStock - quantity;
    return await this.update({ availableStock: newStock });
  }

  // Delete addon
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.EVENT_ADDONS || 'EventAddons',
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting addon:', error);
      throw error;
    }
  }

  // Get all addons (admin use)
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.EVENT_ADDONS || 'EventAddons'
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new EventAddon(item));
    } catch (error) {
      console.error('Error finding all addons:', error);
      throw error;
    }
  }
}

module.exports = EventAddon;

