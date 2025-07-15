const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Volunteer {
  constructor(data = {}) {
    this.opportunityId = data.opportunityId;
    this.opportunityTitle = data.opportunityTitle;
    this.opportunityCategory = data.opportunityCategory;
    this.applicantName = data.applicantName;
    this.applicantEmail = data.applicantEmail;
    this.applicantPhone = data.applicantPhone;
    this.applicantAge = data.applicantAge;
    this.applicantAddress = data.applicantAddress || {};
    this.availability = data.availability || {
      weekdays: false,
      weekends: false,
      evenings: false,
      flexible: false
    };
    this.experience = data.experience;
    this.skills = data.skills || [];
    this.motivation = data.motivation;
    this.timeCommitment = data.timeCommitment;
    this.references = data.references || [];
    this.emergencyContact = data.emergencyContact || {};
    this.backgroundCheck = data.backgroundCheck || {
      consent: false,
      completed: false,
      dateCompleted: null
    };
    this.status = data.status || 'pending';
    this.applicationDate = data.applicationDate || new Date().toISOString();
    this.reviewDate = data.reviewDate || null;
    this.reviewNotes = data.reviewNotes || null;
    this.assignedEvents = data.assignedEvents || [];
    this.totalHours = data.totalHours || 0;
    this.lastActive = data.lastActive || new Date().toISOString();
  }

  // Create a new volunteer application
  static async create(volunteerData) {
    const volunteer = new Volunteer(volunteerData);
    const command = new PutCommand({
      TableName: TABLES.VOLUNTEERS,
      Item: volunteer
    });

    try {
      await docClient.send(command);
      return volunteer;
    } catch (error) {
      console.error('Error creating volunteer application:', error);
      throw error;
    }
  }

  // Get volunteer application by opportunityId and applicantEmail
  static async findByOpportunityAndEmail(opportunityId, applicantEmail) {
    const command = new GetCommand({
      TableName: TABLES.VOLUNTEERS,
      Key: { 
        opportunityId,
        applicantEmail 
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Volunteer(result.Item) : null;
    } catch (error) {
      console.error('Error finding volunteer application:', error);
      throw error;
    }
  }

  // Get all volunteer applications for an opportunity
  static async findByOpportunity(opportunityId) {
    const command = new QueryCommand({
      TableName: TABLES.VOLUNTEERS,
      KeyConditionExpression: 'opportunityId = :opportunityId',
      ExpressionAttributeValues: {
        ':opportunityId': opportunityId
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Volunteer(item));
    } catch (error) {
      console.error('Error finding volunteers by opportunity:', error);
      throw error;
    }
  }

  // Get all volunteer applications by status
  static async findByStatus(status) {
    const command = new ScanCommand({
      TableName: TABLES.VOLUNTEERS,
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
      return result.Items.map(item => new Volunteer(item));
    } catch (error) {
      console.error('Error finding volunteers by status:', error);
      throw error;
    }
  }

  // Get all volunteer applications by category
  static async findByCategory(category) {
    const command = new ScanCommand({
      TableName: TABLES.VOLUNTEERS,
      FilterExpression: '#category = :category',
      ExpressionAttributeNames: {
        '#category': 'opportunityCategory'
      },
      ExpressionAttributeValues: {
        ':category': category
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Volunteer(item));
    } catch (error) {
      console.error('Error finding volunteers by category:', error);
      throw error;
    }
  }

  // Update volunteer application
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'opportunityId' && key !== 'applicantEmail') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const command = new UpdateCommand({
      TableName: TABLES.VOLUNTEERS,
      Key: { 
        opportunityId: this.opportunityId,
        applicantEmail: this.applicantEmail 
      },
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
      console.error('Error updating volunteer application:', error);
      throw error;
    }
  }

  // Update volunteer application by keys (static method)
  static async updateByKeys(opportunityId, applicantEmail, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'opportunityId' && key !== 'applicantEmail') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const command = new UpdateCommand({
      TableName: TABLES.VOLUNTEERS,
      Key: { 
        opportunityId,
        applicantEmail 
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Volunteer(result.Attributes);
    } catch (error) {
      console.error('Error updating volunteer application by keys:', error);
      throw error;
    }
  }

  // Delete volunteer application
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.VOLUNTEERS,
      Key: { 
        opportunityId: this.opportunityId,
        applicantEmail: this.applicantEmail 
      }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting volunteer application:', error);
      throw error;
    }
  }

  // Get all volunteer applications
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.VOLUNTEERS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Volunteer(item));
    } catch (error) {
      console.error('Error finding all volunteer applications:', error);
      throw error;
    }
  }

  // Get volunteer applications by applicant email
  static async findByApplicantEmail(applicantEmail) {
    const command = new ScanCommand({
      TableName: TABLES.VOLUNTEERS,
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
      return result.Items.map(item => new Volunteer(item));
    } catch (error) {
      console.error('Error finding volunteer applications by email:', error);
      throw error;
    }
  }
}

module.exports = Volunteer; 