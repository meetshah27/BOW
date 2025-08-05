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

const TABLE_NAME = 'NewsletterCampaigns';

class NewsletterCampaign {
  static async create(campaignData) {
    const {
      title,
      subject,
      content,
      author,
      status = 'draft', // draft, scheduled, sent
      scheduledDate,
      sentDate,
      targetAudience = 'all', // all, events, stories, volunteerOpportunities, donationUpdates
      template = 'default',
      metadata = {}
    } = campaignData;

    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const item = {
      campaignId,
      title,
      subject,
      content,
      author,
      status,
      scheduledDate,
      sentDate,
      targetAudience,
      template,
      metadata,
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

  static async findById(campaignId) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { campaignId }
    });

    const response = await docClient.send(command);
    return response.Item;
  }

  static async getAllCampaigns() {
    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async getCampaignsByStatus(status) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async updateCampaign(campaignId, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
      if (key !== 'campaignId') {
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
      Key: { campaignId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async deleteCampaign(campaignId) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { campaignId }
    });

    await docClient.send(command);
    return { message: 'Campaign deleted successfully' };
  }

  static async scheduleCampaign(campaignId, scheduledDate) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { campaignId },
      UpdateExpression: 'SET #status = :status, scheduledDate = :scheduledDate, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':status': 'scheduled',
        ':scheduledDate': scheduledDate,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async markAsSent(campaignId) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { campaignId },
      UpdateExpression: 'SET #status = :status, sentDate = :sentDate, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':status': 'sent',
        ':sentDate': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async getScheduledCampaigns() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status AND scheduledDate <= :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'scheduled',
        ':now': new Date().toISOString()
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  static async getCampaignStats() {
    const campaigns = await this.getAllCampaigns();
    
    const stats = {
      total: campaigns.length,
      draft: campaigns.filter(c => c.status === 'draft').length,
      scheduled: campaigns.filter(c => c.status === 'scheduled').length,
      sent: campaigns.filter(c => c.status === 'sent').length
    };

    return stats;
  }
}

module.exports = NewsletterCampaign; 