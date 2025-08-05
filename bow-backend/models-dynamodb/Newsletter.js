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

const TABLE_NAME = 'NewsletterSubscribers';

class Newsletter {
  static async create(subscriberData) {
    const {
      email,
      firstName,
      lastName,
      isActive = true,
      subscriptionDate = new Date().toISOString(),
      preferences = {
        events: true,
        stories: true,
        volunteerOpportunities: true,
        donationUpdates: true
      }
    } = subscriberData;

    const item = {
      email: email.toLowerCase(),
      firstName: firstName || '',
      lastName: lastName || '',
      isActive: isActive ? 'true' : 'false', // Store as string for GSI compatibility
      subscriptionDate,
      preferences,
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(email)'
    });

    try {
      await docClient.send(command);
      return item;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Email already subscribed to newsletter');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { email: email.toLowerCase() }
    });

    const response = await docClient.send(command);
    return response.Item;
  }

  static async getAllSubscribers() {
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

  static async getActiveSubscribers() {
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

  static async updateSubscriber(email, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
      if (key !== 'email') { // Don't allow email updates
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
      Key: { email: email.toLowerCase() },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async unsubscribe(email) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { email: email.toLowerCase() },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': 'false',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async resubscribe(email) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { email: email.toLowerCase() },
      UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  static async deleteSubscriber(email) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { email: email.toLowerCase() }
    });

    await docClient.send(command);
    return { message: 'Subscriber deleted successfully' };
  }

  static async getSubscriberCount() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':isActive': 'true'
      },
      Select: 'COUNT'
    });

    const response = await docClient.send(command);
    return response.Count || 0;
  }

  static async getSubscribersByPreference(preference) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'isActive = :isActive AND preferences.#pref = :prefValue',
      ExpressionAttributeNames: {
        '#pref': preference
      },
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':prefValue': true
      }
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }
}

module.exports = Newsletter; 