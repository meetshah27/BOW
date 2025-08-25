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

class MissionMedia {
  constructor(data = {}) {
    this.id = data.id || 'mission-media';
    this.mediaType = data.mediaType || 'image'; // 'image' or 'video'
    this.mediaUrl = data.mediaUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.title = data.title || 'Our Mission';
    this.description = data.description || 'Beats of Washington Mission';
    this.altText = data.altText || 'Mission media';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Get mission media
  static async getMissionMedia() {
    const command = new GetCommand({
      TableName: TABLES.MISSION_MEDIA,
      Key: { id: 'mission-media' }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new MissionMedia(result.Item);
      }
      // Return default settings if none exist
      return new MissionMedia();
    } catch (error) {
      console.error('Error getting mission media:', error);
      throw error;
    }
  }

  // Save mission media
  async save() {
    const command = new PutCommand({
      TableName: TABLES.MISSION_MEDIA,
      Item: {
        id: this.id,
        mediaType: this.mediaType,
        mediaUrl: this.mediaUrl,
        thumbnailUrl: this.thumbnailUrl,
        title: this.title,
        description: this.description,
        altText: this.altText,
        isActive: this.isActive,
        uploadedAt: this.uploadedAt,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      await docClient.send(command);
      return this;
    } catch (error) {
      console.error('Error saving mission media:', error);
      throw error;
    }
  }

  // Update mission media
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
      TableName: TABLES.MISSION_MEDIA,
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
      console.error('Error updating mission media:', error);
      throw error;
    }
  }

  // Delete mission media
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.MISSION_MEDIA,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting mission media:', error);
      throw error;
    }
  }
}

module.exports = MissionMedia;
