const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Donation {
  constructor(data = {}) {
    this.paymentIntentId = data.paymentIntentId || uuidv4();
    this.amount = data.amount;
    this.currency = data.currency || 'usd';
    this.donorEmail = data.donorEmail;
    this.donorName = data.donorName;
    this.donorId = data.donorId || null;
    this.status = data.status || 'pending';
    this.paymentMethod = data.paymentMethod || 'card';
    this.isRecurring = data.isRecurring || false;
    this.frequency = data.frequency || 'one-time';
    this.metadata = data.metadata || {};
    this.stripeCustomerId = data.stripeCustomerId || null;
    this.receiptUrl = data.receiptUrl || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new donation
  static async create(donationData) {
    const donation = new Donation(donationData);
    const command = new PutCommand({
      TableName: TABLES.DONATIONS,
      Item: donation
    });

    try {
      await docClient.send(command);
      return donation;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  }

  // Get donation by paymentIntentId
  static async findByPaymentIntentId(paymentIntentId) {
    const command = new GetCommand({
      TableName: TABLES.DONATIONS,
      Key: { paymentIntentId }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Donation(result.Item) : null;
    } catch (error) {
      console.error('Error finding donation by paymentIntentId:', error);
      throw error;
    }
  }

  // Update donation
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'paymentIntentId') { // Don't allow updating paymentIntentId
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
      TableName: TABLES.DONATIONS,
      Key: { paymentIntentId: this.paymentIntentId },
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
      console.error('Error updating donation:', error);
      throw error;
    }
  }

  // Update donation by paymentIntentId (static method)
  static async updateByPaymentIntentId(paymentIntentId, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'paymentIntentId') {
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
      TableName: TABLES.DONATIONS,
      Key: { paymentIntentId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      return new Donation(result.Attributes);
    } catch (error) {
      console.error('Error updating donation by paymentIntentId:', error);
      throw error;
    }
  }

  // Delete donation by paymentIntentId
  static async deleteByPaymentIntentId(paymentIntentId) {
    const command = new DeleteCommand({
      TableName: TABLES.DONATIONS,
      Key: { paymentIntentId }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting donation by paymentIntentId:', error);
      throw error;
    }
  }

  // Delete donation
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.DONATIONS,
      Key: { paymentIntentId: this.paymentIntentId }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  }

  // Get all donations with pagination
  static async findAll(options = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;
    
    let command = new ScanCommand({
      TableName: TABLES.DONATIONS
    });

    // Add filter for status if provided
    if (status) {
      command = new ScanCommand({
        TableName: TABLES.DONATIONS,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status
        }
      });
    }

    try {
      const result = await docClient.send(command);
      const donations = result.Items.map(item => new Donation(item));
      
      // Sort by createdAt descending and apply pagination
      donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const paginatedDonations = donations.slice(skip, skip + parseInt(limit));
      
      return {
        donations: paginatedDonations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: donations.length,
          pages: Math.ceil(donations.length / limit)
        }
      };
    } catch (error) {
      console.error('Error finding all donations:', error);
      throw error;
    }
  }

  // Get donation statistics
  static async getStats() {
    const command = new ScanCommand({
      TableName: TABLES.DONATIONS,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'succeeded'
      }
    });

    try {
      const result = await docClient.send(command);
      const succeededDonations = result.Items.map(item => new Donation(item));
      
      const totalDonations = succeededDonations.length;
      const totalAmount = succeededDonations.reduce((sum, donation) => sum + donation.amount, 0);
      
      // Calculate monthly stats
      const monthlyStats = succeededDonations.reduce((stats, donation) => {
        const date = new Date(donation.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;
        
        if (!stats[key]) {
          stats[key] = { count: 0, amount: 0 };
        }
        
        stats[key].count++;
        stats[key].amount += donation.amount;
        
        return stats;
      }, {});
      
      // Convert to array and sort by date
      const monthlyStatsArray = Object.entries(monthlyStats)
        .map(([key, stats]) => {
          const [year, month] = key.split('-');
          return {
            _id: { year: parseInt(year), month: parseInt(month) },
            count: stats.count,
            amount: stats.amount
          };
        })
        .sort((a, b) => b._id.year - a._id.year || b._id.month - a._id.month)
        .slice(0, 12);
      
      return {
        totalDonations,
        totalAmount,
        monthlyStats: monthlyStatsArray
      };
    } catch (error) {
      console.error('Error getting donation stats:', error);
      throw error;
    }
  }

  // Find donations by donor email
  static async findByDonorEmail(donorEmail) {
    const command = new ScanCommand({
      TableName: TABLES.DONATIONS,
      FilterExpression: '#donorEmail = :donorEmail',
      ExpressionAttributeNames: {
        '#donorEmail': 'donorEmail'
      },
      ExpressionAttributeValues: {
        ':donorEmail': donorEmail
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Donation(item));
    } catch (error) {
      console.error('Error finding donations by donor email:', error);
      throw error;
    }
  }
}

module.exports = Donation; 