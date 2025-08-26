const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Founder {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.role = data.role;
    this.bio = data.bio || '';
    this.image = data.image || '';
    this.mediaType = data.mediaType || 'image'; // 'image' or 'video'
    this.mediaUrl = data.mediaUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.mediaTitle = data.mediaTitle || '';
    this.mediaDescription = data.mediaDescription || '';
    this.mediaAltText = data.mediaAltText || '';
    this.isMediaActive = data.isMediaActive !== undefined ? data.isMediaActive : false;
    this.mediaOverlayOpacity = data.mediaOverlayOpacity || 0.1;
    this.social = data.social || {
      instagram: '',
      facebook: '',
      youtube: ''
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new founder
  static async create(founderData) {
    const founder = new Founder(founderData);
    const command = new PutCommand({
      TableName: TABLES.FOUNDERS,
      Item: founder
    });

    try {
      await docClient.send(command);
      return founder;
    } catch (error) {
      console.error('Error creating founder:', error);
      throw error;
    }
  }

  // Get founder by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.FOUNDERS,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Founder(result.Item) : null;
    } catch (error) {
      console.error('Error finding founder by ID:', error);
      throw error;
    }
  }

  // Get founder by name
  static async findByName(name) {
    const command = new ScanCommand({
      TableName: TABLES.FOUNDERS,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.length > 0 ? new Founder(result.Items[0]) : null;
    } catch (error) {
      console.error('Error finding founder by name:', error);
      throw error;
    }
  }

  // Get all founders
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.FOUNDERS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Founder(item));
    } catch (error) {
      console.error('Error finding all founders:', error);
      throw error;
    }
  }

  // Update founder
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    // Always update the updatedAt field
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.FOUNDERS,
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
      console.error('Error updating founder:', error);
      throw error;
    }
  }

  // Update founder by ID (static method)
  static async updateById(id, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    // Always update the updatedAt field
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.FOUNDERS,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Founder(result.Attributes);
    } catch (error) {
      console.error('Error updating founder by ID:', error);
      throw error;
    }
  }

  // Delete founder
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.FOUNDERS,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting founder:', error);
      throw error;
    }
  }

  // Delete founder by ID (static method)
  static async deleteById(id) {
    const command = new DeleteCommand({
      TableName: TABLES.FOUNDERS,
      Key: { id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting founder by ID:', error);
      throw error;
    }
  }
}

module.exports = Founder; 