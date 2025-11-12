const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Membership {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.applicantName = data.applicantName;
    this.applicantEmail = data.applicantEmail;
    this.applicantPhone = data.applicantPhone;
    this.applicantAge = data.applicantAge;
    this.applicantGender = data.applicantGender;
    this.experience = data.experience;
    this.interest = data.interest;
    this.socialMediaFollowed = data.socialMediaFollowed;
    this.status = data.status || 'pending';
    this.applicationDate = data.applicationDate || new Date().toISOString();
    this.reviewDate = data.reviewDate || null;
    this.reviewNotes = data.reviewNotes || null;
  }

  // Create a new membership application
  static async create(membershipData) {
    console.log('Creating membership application with data:', membershipData);
    
    const membership = new Membership(membershipData);
    
    console.log('Membership object created:', membership);
    
    // Validate required fields
    if (!membership.applicantEmail) {
      throw new Error('applicantEmail is required for membership applications');
    }
    
    // Check if applicant already applied
    const existingApplication = await Membership.findByEmail(membership.applicantEmail);
    if (existingApplication) {
      throw new Error('You have already submitted a membership application. Please wait for review.');
    }
    
    const command = new PutCommand({
      TableName: TABLES.MEMBERSHIPS,
      Item: membership
    });

    try {
      console.log('Sending DynamoDB command with Item:', membership);
      await docClient.send(command);
      return membership;
    } catch (error) {
      console.error('Error creating membership application:', error);
      throw error;
    }
  }

  // Get membership application by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.MEMBERSHIPS,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Membership(result.Item) : null;
    } catch (error) {
      console.error('Error finding membership application by ID:', error);
      throw error;
    }
  }

  // Get membership application by email
  static async findByEmail(applicantEmail) {
    const command = new ScanCommand({
      TableName: TABLES.MEMBERSHIPS,
      FilterExpression: '#applicantEmail = :applicantEmail',
      ExpressionAttributeNames: {
        '#applicantEmail': 'applicantEmail'
      },
      ExpressionAttributeValues: {
        ':applicantEmail': applicantEmail
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.length > 0 ? new Membership(result.Items[0]) : null;
    } catch (error) {
      console.error('Error finding membership application by email:', error);
      throw error;
    }
  }

  // Get all membership applications by status
  static async findByStatus(status) {
    const command = new ScanCommand({
      TableName: TABLES.MEMBERSHIPS,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Membership(item));
    } catch (error) {
      console.error('Error finding membership applications by status:', error);
      throw error;
    }
  }

  // Update membership application
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

    const command = new UpdateCommand({
      TableName: TABLES.MEMBERSHIPS,
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
      console.error('Error updating membership application:', error);
      throw error;
    }
  }

  // Update membership application by ID (static method)
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

    const command = new UpdateCommand({
      TableName: TABLES.MEMBERSHIPS,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Membership(result.Attributes);
    } catch (error) {
      console.error('Error updating membership application by ID:', error);
      throw error;
    }
  }

  // Delete membership application
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.MEMBERSHIPS,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting membership application:', error);
      throw error;
    }
  }

  // Delete membership application by ID (static method)
  static async deleteById(id) {
    const command = new DeleteCommand({
      TableName: TABLES.MEMBERSHIPS,
      Key: { id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting membership application by ID:', error);
      throw error;
    }
  }

  // Get all membership applications
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.MEMBERSHIPS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Membership(item));
    } catch (error) {
      console.error('Error finding all membership applications:', error);
      throw error;
    }
  }

  // Get membership statistics
  static async getStats() {
    const command = new ScanCommand({
      TableName: TABLES.MEMBERSHIPS,
      ProjectionExpression: '#status',
      ExpressionAttributeNames: {
        '#status': 'status'
      }
    });

    try {
      const result = await docClient.send(command);
      const stats = {
        total: result.Items.length,
        pending: 0,
        approved: 0,
        rejected: 0
      };

      result.Items.forEach(item => {
        stats[item.status] = (stats[item.status] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting membership statistics:', error);
      throw error;
    }
  }
}

module.exports = Membership;
