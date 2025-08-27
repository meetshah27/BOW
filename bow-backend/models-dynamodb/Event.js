const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Event {
  constructor(data = {}) {
    // Handle both id and _id fields for compatibility
    this.id = data.id || data._id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.longDescription = data.longDescription;
    this.date = data.date;
    this.time = data.time;
    this.location = data.location;
    this.address = data.address;
    this.category = data.category;
    this.image = data.image;
    this.capacity = data.capacity;
    this.registeredCount = data.registeredCount || 0;
    this.price = data.price || 0;
    this.organizer = data.organizer;
    this.contact = data.contact || {};
    this.tags = data.tags || [];
    this.featured = data.featured || false;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.isLive = data.isLive || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new event
  static async create(eventData) {
    const event = new Event(eventData);
    const command = new PutCommand({
      TableName: TABLES.EVENTS,
      Item: event
    });

    try {
      await docClient.send(command);
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Get event by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.EVENTS,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Event(result.Item) : null;
    } catch (error) {
      console.error('Error finding event by ID:', error);
      throw error;
    }
  }

  // Update event
  async update(updateData) {
    // Validate update data
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('No update data provided');
    }
    
    // Validate that we have an ID to update
    if (!this.id) {
      throw new Error('Event ID is missing. Cannot update event without ID.');
    }
    
    console.log('[Event.update] Updating event with ID:', this.id);
    console.log('[Event.update] Update data:', updateData);
    
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    let updatingUpdatedAt = false;
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== '_id') { // Don't allow updating ID fields
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
        if (key === 'updatedAt') updatingUpdatedAt = true;
      }
    });

    // Only add updatedAt if not already being updated
    if (!updatingUpdatedAt) {
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    }

    console.log('[Event.update] Update expressions:', updateExpressions);
    console.log('[Event.update] Expression attribute names:', expressionAttributeNames);
    console.log('[Event.update] Expression attribute values:', expressionAttributeValues);
    
    const command = new UpdateCommand({
      TableName: TABLES.EVENTS,
      Key: { id: this.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    
    console.log('[Event.update] DynamoDB command:', JSON.stringify(command, null, 2));

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.EVENTS,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Get all events
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.EVENTS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Event(item));
    } catch (error) {
      console.error('Error finding all events:', error);
      throw error;
    }
  }

  // Find events by category
  static async findByCategory(category) {
    const command = new QueryCommand({
      TableName: TABLES.EVENTS,
      IndexName: 'category-date-index',
      KeyConditionExpression: '#category = :category',
      ExpressionAttributeNames: {
        '#category': 'category'
      },
      ExpressionAttributeValues: {
        ':category': category
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Event(item));
    } catch (error) {
      console.error('Error finding events by category:', error);
      throw error;
    }
  }

  // Find featured events
  static async findFeatured() {
    const command = new ScanCommand({
      TableName: TABLES.EVENTS,
      FilterExpression: '#featured = :featured',
      ExpressionAttributeNames: {
        '#featured': 'featured'
      },
      ExpressionAttributeValues: {
        ':featured': true
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Event(item));
    } catch (error) {
      console.error('Error finding featured events:', error);
      throw error;
    }
  }

  // Find active events
  static async findActive() {
    const command = new ScanCommand({
      TableName: TABLES.EVENTS,
      FilterExpression: '#isActive = :isActive',
      ExpressionAttributeNames: {
        '#isActive': 'isActive'
      },
      ExpressionAttributeValues: {
        ':isActive': true
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Event(item));
    } catch (error) {
      console.error('Error finding active events:', error);
      throw error;
    }
  }

  // Increment registered count
  async incrementRegisteredCount() {
    const command = new UpdateCommand({
      TableName: TABLES.EVENTS,
      Key: { id: this.id },
      UpdateExpression: 'SET registeredCount = if_not_exists(registeredCount, :zero) + :inc, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':zero': 0,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error incrementing registered count:', error);
      throw error;
    }
  }
}

module.exports = Event; 