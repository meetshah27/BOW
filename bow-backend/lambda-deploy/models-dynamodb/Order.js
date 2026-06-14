const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Order {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.userId = data.userId || 'guest';
    this.items = data.items || []; // Array of { productId, name, price, quantity, size, color }
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending'; // pending, paid, shipped, delivered, cancelled
    this.paymentIntentId = data.paymentIntentId || null;
    this.shippingAddress = data.shippingAddress || {};
    this.customerEmail = data.customerEmail || '';
    this.customerName = data.customerName || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.metadata = data.metadata || {};
  }

  // Create a new order
  static async create(orderData) {
    const order = new Order(orderData);
    const command = new PutCommand({
      TableName: TABLES.ORDERS,
      Item: order
    });

    try {
      await docClient.send(command);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.ORDERS,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Order(result.Item) : null;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      throw error;
    }
  }

  // Find orders by user ID
  static async findByUserId(userId) {
    const command = new QueryCommand({
      TableName: TABLES.ORDERS,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new Order(item)) : [];
    } catch (error) {
      console.error('Error finding orders by user ID:', error);
      throw error;
    }
  }

  // Find orders by customer email
  static async findByCustomerEmail(email) {
    const command = new ScanCommand({
      TableName: TABLES.ORDERS,
      FilterExpression: '#customerEmail = :email',
      ExpressionAttributeNames: {
        '#customerEmail': 'customerEmail'
      },
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new Order(item)) : [];
    } catch (error) {
      console.error('Error finding orders by customer email:', error);
      throw error;
    }
  }

  // Update order
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

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.ORDERS,
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
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Get all orders (for admin)
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.ORDERS
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new Order(item)) : [];
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw error;
    }
  }
}

module.exports = Order;
