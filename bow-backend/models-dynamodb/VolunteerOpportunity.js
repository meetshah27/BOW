require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, DeleteCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'VolunteerOpportunities';

class VolunteerOpportunity {
  static async create(opportunityData) {
    const {
      title,
      category,
      location,
      timeCommitment,
      description,
      requirements = [],
      benefits = [],
      isActive = true,
      maxVolunteers,
      currentVolunteers = 0
    } = opportunityData;

    const opportunityId = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const item = {
      opportunityId,
      title,
      category,
      location,
      timeCommitment,
      description,
      requirements,
      benefits,
      isActive: isActive ? 'true' : 'false', // Store as string for GSI compatibility
      maxVolunteers,
      currentVolunteers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });

    await docClient.send(command);
    return item;
  }

  static async findById(opportunityId) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId }
    });

    const response = await docClient.send(command);
    return response.Item;
  }

  static async getAllOpportunities() {
    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async getActiveOpportunities() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':isActive': 'true'
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async getOpportunitiesByCategory(category) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'isActive = :isActive AND #category = :category',
      ExpressionAttributeNames: {
        '#category': 'category'
      },
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':category': category
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async updateOpportunity(opportunityId, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
      if (key !== 'opportunityId') {
        const attributeName = `#attr${index}`;
        const attributeValue = `:val${index}`;
        
        updateExpressions.push(`${attributeName} = ${attributeValue}`);
        expressionAttributeNames[attributeName] = key;
        expressionAttributeValues[attributeValue] = updateData[key];
      }
    });

    if (updateExpressions.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async deleteOpportunity(opportunityId) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId }
    });

    await docClient.send(command);
    return { message: 'Opportunity deleted successfully' };
  }

  static async toggleActive(opportunityId) {
    const opportunity = await this.findById(opportunityId);
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const newStatus = opportunity.isActive === 'true' ? 'false' : 'true';
    
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': newStatus,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async incrementVolunteerCount(opportunityId) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId },
      UpdateExpression: 'SET currentVolunteers = currentVolunteers + :inc, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async decrementVolunteerCount(opportunityId) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { opportunityId },
      UpdateExpression: 'SET currentVolunteers = currentVolunteers - :dec, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':dec': 1,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async getOpportunityStats() {
    const opportunities = await this.getAllOpportunities();
    
    const stats = {
      total: opportunities.length,
      active: opportunities.filter(opp => opp.isActive === 'true').length,
      inactive: opportunities.filter(opp => opp.isActive === 'false').length,
      categories: [...new Set(opportunities.map(opp => opp.category))],
      totalVolunteers: opportunities.reduce((sum, opp) => sum + (opp.currentVolunteers || 0), 0)
    };

    return stats;
  }
}

module.exports = VolunteerOpportunity; 