const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
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

class Settings {
  constructor(data = {}) {
    this.id = data.id || 'app-settings';
    this.membershipApplicationEnabled = data.membershipApplicationEnabled !== undefined 
      ? data.membershipApplicationEnabled 
      : true; // Default to enabled
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.updatedBy = data.updatedBy || 'system';
  }

  // Get application settings
  static async getSettings() {
    const command = new GetCommand({
      TableName: TABLES.SETTINGS,
      Key: { id: 'app-settings' }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new Settings(result.Item);
      }
      // Return default settings if none exist
      const defaultSettings = new Settings();
      // Save default settings to database
      await defaultSettings.save();
      return defaultSettings;
    } catch (error) {
      console.error('Error getting application settings:', error);
      throw error;
    }
  }

  // Save settings
  async save() {
    const command = new PutCommand({
      TableName: TABLES.SETTINGS,
      Item: {
        id: this.id,
        membershipApplicationEnabled: this.membershipApplicationEnabled,
        lastUpdated: new Date().toISOString(),
        updatedBy: this.updatedBy
      }
    });

    try {
      await docClient.send(command);
      this.lastUpdated = new Date().toISOString();
      return this;
    } catch (error) {
      console.error('Error saving application settings:', error);
      throw error;
    }
  }

  // Update settings
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

    updateExpression.push('#lastUpdated = :lastUpdated');
    expressionAttributeNames['#lastUpdated'] = 'lastUpdated';
    expressionAttributeValues[':lastUpdated'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.SETTINGS,
      Key: { id: this.id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      if (result.Attributes) {
        Object.assign(this, result.Attributes);
      }
      return this;
    } catch (error) {
      console.error('Error updating application settings:', error);
      throw error;
    }
  }

  // Delete settings
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.SETTINGS,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting application settings:', error);
      throw error;
    }
  }
}

module.exports = Settings;






