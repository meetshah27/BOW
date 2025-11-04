const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { deleteFromS3 } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

class Gallery {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.album = data.album;
    this.eventId = data.eventId || null; // Link to specific event
    this.imageUrl = data.imageUrl;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async create(data) {
    const item = new Gallery(data);
    const command = new PutCommand({ TableName: TABLES.GALLERY, Item: item });
    await docClient.send(command);
    return item;
  }

  static async findAll() {
    const command = new ScanCommand({ TableName: TABLES.GALLERY });
    const result = await docClient.send(command);
    return result.Items.map(item => new Gallery(item));
  }

  // Find all gallery items for a specific event
  static async findByEventId(eventId) {
    const command = new ScanCommand({ 
      TableName: TABLES.GALLERY,
      FilterExpression: 'eventId = :eventId',
      ExpressionAttributeValues: {
        ':eventId': eventId
      }
    });
    const result = await docClient.send(command);
    return result.Items.map(item => new Gallery(item));
  }

  static async findById(id) {
    const command = new GetCommand({ TableName: TABLES.GALLERY, Key: { id } });
    const result = await docClient.send(command);
    return result.Item ? new Gallery(result.Item) : null;
  }

  static async update(id, updateData) {
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
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: TABLES.GALLERY,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const result = await docClient.send(command);
    return new Gallery(result.Attributes);
  }

  static async delete(id) {
    try {
      // First, get the image to find the S3 file path
      const image = await this.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }

      // Delete from DynamoDB
      const command = new DeleteCommand({ TableName: TABLES.GALLERY, Key: { id } });
      await docClient.send(command);

      // Delete from S3 if imageUrl exists
      if (image.imageUrl) {
        try {
          // Extract the file path from the S3 URL
          const url = new URL(image.imageUrl);
          const filePath = url.pathname.substring(1); // Remove leading slash
          
          await deleteFromS3(filePath);
          console.log(`✅ S3 file deleted: ${filePath}`);
        } catch (s3Error) {
          console.error('⚠️ S3 deletion failed:', s3Error.message);
          // Don't throw error here, as DynamoDB deletion was successful
        }
      }

      return true;
    } catch (error) {
      console.error('Gallery delete error:', error);
      throw error;
    }
  }
}

module.exports = Gallery; 