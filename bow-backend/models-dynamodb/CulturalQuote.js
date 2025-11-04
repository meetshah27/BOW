const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} = require('@aws-sdk/lib-dynamodb');
const { TABLES } = require('../config/dynamodb');

const docClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

class CulturalQuote {
  constructor(data = {}) {
    this.id = data.id || `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.text = data.text || '';
    this.author = data.author || '';
    this.order = data.order !== undefined ? data.order : 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Save cultural quote
  async save() {
    const command = new PutCommand({
      TableName: TABLES.CULTURAL_QUOTES,
      Item: {
        id: this.id,
        text: this.text,
        author: this.author,
        order: this.order,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      await docClient.send(command);
      this.updatedAt = new Date().toISOString();
      return this;
    } catch (error) {
      console.error('Error saving cultural quote:', error);
      throw error;
    }
  }

  // Update cultural quote
  async update(updates) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && updates[key] !== undefined) {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
      }
    });

    if (updateExpression.length === 0) return this;

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.CULTURAL_QUOTES,
      Key: { id: this.id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error updating cultural quote:', error);
      throw error;
    }
  }

  // Delete cultural quote
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.CULTURAL_QUOTES,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting cultural quote:', error);
      throw error;
    }
  }

  // Get all active quotes (public route)
  static async getActiveQuotes() {
    const command = new ScanCommand({
      TableName: TABLES.CULTURAL_QUOTES,
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':isActive': true
      }
    });

    try {
      const result = await docClient.send(command);
      const quotes = result.Items ? result.Items.map(item => new CulturalQuote(item)) : [];
      // Sort by order, then by createdAt
      return quotes.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } catch (error) {
      console.error('Error getting active cultural quotes:', error);
      throw error;
    }
  }

  // Get all quotes (admin route)
  static async getAllQuotes() {
    const command = new ScanCommand({
      TableName: TABLES.CULTURAL_QUOTES
    });

    try {
      const result = await docClient.send(command);
      const quotes = result.Items ? result.Items.map(item => new CulturalQuote(item)) : [];
      // Sort by order, then by createdAt
      return quotes.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } catch (error) {
      console.error('Error getting all cultural quotes:', error);
      throw error;
    }
  }

  // Get quote by ID
  static async getById(id) {
    const command = new GetCommand({
      TableName: TABLES.CULTURAL_QUOTES,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new CulturalQuote(result.Item);
      }
      return null;
    } catch (error) {
      console.error('Error getting cultural quote by ID:', error);
      throw error;
    }
  }
}

module.exports = CulturalQuote;

