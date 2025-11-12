const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} = require('@aws-sdk/lib-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { TABLES } = require('../config/dynamodb');

// Check if running in Lambda
const isLambda = !!process.env.LAMBDA_TASK_ROOT || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  // In Lambda, NEVER use explicit credentials - always use IAM role
  // Only use explicit credentials for local development (outside Lambda)
  ...(!isLambda && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  } : {})
});

const docClient = DynamoDBDocumentClient.from(client);

class Hero {
  constructor(data = {}) {
    this.id = data.id || 'hero-settings';
    this.backgroundType = data.backgroundType || 'image';
    this.backgroundUrl = data.backgroundUrl || '';
    this.overlayOpacity = data.overlayOpacity || 0.2;
    this.title = data.title || 'Empowering Communities';
    this.subtitle = data.subtitle || 'Through Music';
    this.description = data.description !== undefined ? data.description : 'Beats of Washington connects, inspires, and celebrates cultural diversity through music and community events across Washington State since 2019.';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Get hero settings
  static async getSettings() {
    const command = new GetCommand({
      TableName: TABLES.HERO,
      Key: { id: 'hero-settings' }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new Hero(result.Item);
      }
      // Return default settings if none exist
      return new Hero();
    } catch (error) {
      console.error('Error getting hero settings:', error);
      throw error;
    }
  }

  // Save hero settings
  async save() {
    const command = new PutCommand({
      TableName: TABLES.HERO,
      Item: {
        id: this.id,
        backgroundType: this.backgroundType,
        backgroundUrl: this.backgroundUrl,
        overlayOpacity: this.overlayOpacity,
        title: this.title,
        subtitle: this.subtitle,
        description: this.description,
        isActive: this.isActive,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      await docClient.send(command);
      return this;
    } catch (error) {
      console.error('Error saving hero settings:', error);
      throw error;
    }
  }

  // Update hero settings
  async update(updates) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && updates[key] !== undefined) {
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
      TableName: TABLES.HERO,
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
      console.error('Error updating hero settings:', error);
      throw error;
    }
  }

  // Delete hero settings
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.HERO,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting hero settings:', error);
      throw error;
    }
  }
}

module.exports = Hero;
