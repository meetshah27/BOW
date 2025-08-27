const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Registration {
  constructor(data = {}) {
    this.eventId = data.eventId;
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.userName = data.userName;
    this.phone = data.phone;
    this.dietaryRestrictions = data.dietaryRestrictions || '';
    this.specialRequests = data.specialRequests || '';
    this.ticketNumber = data.ticketNumber || uuidv4();
    this.registrationDate = data.registrationDate || new Date().toISOString();
    this.status = data.status || 'confirmed';
    this.checkedIn = data.checkedIn || false;
    this.checkInTime = data.checkInTime || null;
    this.notes = data.notes || '';
    
    // Payment information for paid events
    this.paymentAmount = data.paymentAmount || 0;
    this.paymentIntentId = data.paymentIntentId || null;
    this.paymentDate = data.paymentDate || null;
    this.paymentStatus = data.paymentStatus || 'none'; // none, pending, completed, failed
    this.paymentMethod = data.paymentMethod || null; // card type and last 4 digits
    this.isPaidEvent = data.isPaidEvent || false;
  }

  // Create a new registration
  static async create(registrationData) {
    const registration = new Registration(registrationData);
    const command = new PutCommand({
      TableName: TABLES.REGISTRATIONS,
      Item: registration
    });

    try {
      await docClient.send(command);
      return registration;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }

  // Get registration by eventId and userId
  static async findByEventAndUser(eventId, userId) {
    const command = new GetCommand({
      TableName: TABLES.REGISTRATIONS,
      Key: { 
        eventId,
        userId 
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Registration(result.Item) : null;
    } catch (error) {
      console.error('Error finding registration:', error);
      throw error;
    }
  }

  // Get registration by ticket number
  static async findByTicketNumber(ticketNumber) {
    const command = new ScanCommand({
      TableName: TABLES.REGISTRATIONS,
      FilterExpression: '#ticketNumber = :ticketNumber',
      ExpressionAttributeNames: {
        '#ticketNumber': 'ticketNumber'
      },
      ExpressionAttributeValues: {
        ':ticketNumber': ticketNumber
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.length > 0 ? new Registration(result.Items[0]) : null;
    } catch (error) {
      console.error('Error finding registration by ticket number:', error);
      throw error;
    }
  }

  // Get all registrations for an event
  static async findByEvent(eventId) {
    const command = new QueryCommand({
      TableName: TABLES.REGISTRATIONS,
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: {
        ':eventId': eventId
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Registration(item));
    } catch (error) {
      console.error('Error finding registrations by event:', error);
      throw error;
    }
  }

  // Get all registrations for a user
  static async findByUser(userId) {
    const command = new ScanCommand({
      TableName: TABLES.REGISTRATIONS,
      FilterExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Registration(item));
    } catch (error) {
      console.error('Error finding registrations by user:', error);
      throw error;
    }
  }

  // Get registrations by status
  static async findByStatus(status) {
    const command = new ScanCommand({
      TableName: TABLES.REGISTRATIONS,
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
      return result.Items.map(item => new Registration(item));
    } catch (error) {
      console.error('Error finding registrations by status:', error);
      throw error;
    }
  }

  // Update registration
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'eventId' && key !== 'userId') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const command = new UpdateCommand({
      TableName: TABLES.REGISTRATIONS,
      Key: { 
        eventId: this.eventId,
        userId: this.userId 
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
      console.error('Error updating registration:', error);
      throw error;
    }
  }

  // Update registration by keys (static method)
  static async updateByKeys(eventId, userId, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'eventId' && key !== 'userId') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const command = new UpdateCommand({
      TableName: TABLES.REGISTRATIONS,
      Key: { 
        eventId,
        userId 
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Registration(result.Attributes);
    } catch (error) {
      console.error('Error updating registration by keys:', error);
      throw error;
    }
  }

  // Check in a registration
  static async checkIn(eventId, userId) {
    const command = new UpdateCommand({
      TableName: TABLES.REGISTRATIONS,
      Key: { 
        eventId,
        userId 
      },
      UpdateExpression: 'SET #checkedIn = :checkedIn, #checkInTime = :checkInTime',
      ExpressionAttributeNames: {
        '#checkedIn': 'checkedIn',
        '#checkInTime': 'checkInTime'
      },
      ExpressionAttributeValues: {
        ':checkedIn': true,
        ':checkInTime': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Registration(result.Attributes);
    } catch (error) {
      console.error('Error checking in registration:', error);
      throw error;
    }
  }

  // Delete registration
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.REGISTRATIONS,
      Key: { 
        eventId: this.eventId,
        userId: this.userId 
      }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }

  // Get all registrations
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.REGISTRATIONS
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Registration(item));
    } catch (error) {
      console.error('Error finding all registrations:', error);
      throw error;
    }
  }

  // Get registration count for an event
  static async getEventRegistrationCount(eventId) {
    const command = new QueryCommand({
      TableName: TABLES.REGISTRATIONS,
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: {
        ':eventId': eventId
      },
      Select: 'COUNT'
    });

    try {
      const result = await docClient.send(command);
      return result.Count || 0;
    } catch (error) {
      console.error('Error getting event registration count:', error);
      throw error;
    }
  }
}

module.exports = Registration; 