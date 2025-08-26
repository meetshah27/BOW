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

class FounderContent {
  constructor(data = {}) {
    this.id = data.id || 'founder-content-settings';
    this.sectionTitle = data.sectionTitle || 'Our Founders';
    this.sectionSubtitle = data.sectionSubtitle || 'Meet the visionary leaders who founded Beats of Washington and continue to guide our mission of empowering communities through music.';
    
    // Aand Sane details
    this.aandSane = {
      name: data.aandSane?.name || 'Aand Sane',
      role: data.aandSane?.role || 'Board Chair & Co-Founder',
      partnership: data.aandSane?.partnership || 'Partnering with Deepali Sane',
      description: data.aandSane?.description || 'Aand Sane & Deepali Sane are the visionary co-founders of Beats of Washington, whose shared passion for community building through music has inspired thousands across Washington State. As Board Chair, Aand continues to lead our organization with dedication and innovative thinking, working closely with Deepali to guide our mission together.',
      traits: data.aandSane?.traits || ['Visionary Leader', 'Community Builder'],
      avatar: data.aandSane?.avatar || 'A',
      isActive: data.aandSane?.isActive !== undefined ? data.aandSane.isActive : true
    };
    
    // Deepali Sane details
    this.deepaliSane = {
      name: data.deepaliSane?.name || 'Deepali Sane',
      role: data.deepaliSane?.role || 'Co-Founder & Strategic Director',
      description: data.deepaliSane?.description || 'Deepali Sane brings her strategic vision and cultural expertise to BOW, working alongside Aand to create meaningful community connections through music and cultural exchange.',
      traits: data.deepaliSane?.traits || ['Strategic Vision', 'Cultural Expert'],
      isActive: data.deepaliSane?.isActive !== undefined ? data.deepaliSane.isActive : true
    };
    
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Get founder content settings
  static async getSettings() {
    const command = new GetCommand({
      TableName: TABLES.FOUNDER_CONTENT,
      Key: { id: 'founder-content-settings' }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new FounderContent(result.Item);
      }
      // Return default settings if none exist
      return new FounderContent();
    } catch (error) {
      console.error('Error getting founder content settings:', error);
      throw error;
    }
  }

  // Save founder content settings
  async save() {
    const command = new PutCommand({
      TableName: TABLES.FOUNDER_CONTENT,
      Item: {
        id: this.id,
        sectionTitle: this.sectionTitle,
        sectionSubtitle: this.sectionSubtitle,
        aandSane: this.aandSane,
        deepaliSane: this.deepaliSane,
        isActive: this.isActive,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      await docClient.send(command);
      return this;
    } catch (error) {
      console.error('Error saving founder content settings:', error);
      throw error;
    }
  }

  // Update founder content settings
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
      TableName: TABLES.FOUNDER_CONTENT,
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
      console.error('Error updating founder content settings:', error);
      throw error;
    }
  }

  // Delete founder content settings
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.FOUNDER_CONTENT,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting founder content settings:', error);
      throw error;
    }
  }

  // Get all founder content settings (for admin panel)
  static async getAll() {
    const command = new ScanCommand({
      TableName: TABLES.FOUNDER_CONTENT
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new FounderContent(item)) : [];
    } catch (error) {
      console.error('Error getting all founder content settings:', error);
      throw error;
    }
  }

  // Update specific founder details
  async updateFounder(founderType, updates) {
    if (founderType === 'aand') {
      this.aandSane = { ...this.aandSane, ...updates };
    } else if (founderType === 'deepali') {
      this.deepaliSane = { ...this.deepaliSane, ...updates };
    }
    
    return this.update({ [founderType === 'aand' ? 'aandSane' : 'deepaliSane']: this[founderType === 'aand' ? 'aandSane' : 'deepaliSane'] });
  }
}

module.exports = FounderContent;
