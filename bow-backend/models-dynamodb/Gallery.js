const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Gallery {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.album = data.album;
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
    const command = new DeleteCommand({ TableName: TABLES.GALLERY, Key: { id } });
    await docClient.send(command);
    return true;
  }
}

module.exports = Gallery; 