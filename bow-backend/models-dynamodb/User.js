const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data = {}) {
    this.uid = data.uid || uuidv4();
    this.email = data.email;
    this.displayName = data.displayName;
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.phone = data.phone || null;
    this.photoURL = data.photoURL || null;
    this.password = data.password || null;
    this.role = data.role || 'member';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastSignIn = data.lastSignIn || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new user
  static async create(userData) {
    const user = new User(userData);
    const command = new PutCommand({
      TableName: TABLES.USERS,
      Item: user
    });

    try {
      await docClient.send(command);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by UID
  static async findByUid(uid) {
    const command = new GetCommand({
      TableName: TABLES.USERS,
      Key: { uid }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new User(result.Item) : null;
    } catch (error) {
      console.error('Error finding user by UID:', error);
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email) {
    const command = new QueryCommand({
      TableName: TABLES.USERS,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.length > 0 ? new User(result.Items[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'uid') { // Don't allow updating UID
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
      TableName: TABLES.USERS,
      Key: { uid: this.uid },
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
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.USERS,
      Key: { uid: this.uid }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.USERS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new User(item));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Find users by role
  static async findByRole(role) {
    const command = new ScanCommand({
      TableName: TABLES.USERS,
      FilterExpression: '#role = :role',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':role': role
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new User(item));
    } catch (error) {
      console.error('Error finding users by role:', error);
      throw error;
    }
  }

  // Count all users
  static async countDocuments(filter = {}) {
    const command = new ScanCommand({
      TableName: TABLES.USERS,
      Select: 'COUNT'
    });

    try {
      const result = await docClient.send(command);
      return result.Count || 0;
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  // Count users with filter (simplified version for common use cases)
  static async countDocumentsWithFilter(filter = {}) {
    let filterExpression = '';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Handle common filter cases
    if (filter.isActive !== undefined) {
      filterExpression += '#isActive = :isActive';
      expressionAttributeNames['#isActive'] = 'isActive';
      expressionAttributeValues[':isActive'] = filter.isActive;
    }

    if (filter.role) {
      if (filterExpression) filterExpression += ' AND ';
      filterExpression += '#role = :role';
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = filter.role;
    }

    if (filter.createdAt && filter.createdAt.$gte) {
      if (filterExpression) filterExpression += ' AND ';
      filterExpression += '#createdAt >= :createdAt';
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':createdAt'] = filter.createdAt.$gte;
    }

    const scanParams = {
      TableName: TABLES.USERS,
      Select: 'COUNT'
    };

    if (filterExpression) {
      scanParams.FilterExpression = filterExpression;
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const command = new ScanCommand(scanParams);

    try {
      const result = await docClient.send(command);
      return result.Count || 0;
    } catch (error) {
      console.error('Error counting users with filter:', error);
      throw error;
    }
  }
}

module.exports = User; 