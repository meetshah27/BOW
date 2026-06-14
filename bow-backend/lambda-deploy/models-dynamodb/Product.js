const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Product {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || 'General';
    this.images = data.images || []; // Array of image URLs
    this.sizes = data.sizes || []; // Array of sizes (e.g. ['S', 'M', 'L'])
    this.colors = data.colors || []; // Array of colors
    this.stock = data.stock !== undefined ? data.stock : 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.metadata = data.metadata || {}; // For any extra info
  }

  // Create a new product
  static async create(productData) {
    const product = new Product(productData);
    const command = new PutCommand({
      TableName: TABLES.PRODUCTS,
      Item: product
    });

    try {
      await docClient.send(command);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Get product by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.PRODUCTS,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Product(result.Item) : null;
    } catch (error) {
      console.error('Error finding product by ID:', error);
      throw error;
    }
  }

  // Get all products
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.PRODUCTS
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new Product(item)) : [];
    } catch (error) {
      console.error('Error finding all products:', error);
      throw error;
    }
  }

  // Find products by category
  static async findByCategory(category) {
    const command = new QueryCommand({
      TableName: TABLES.PRODUCTS,
      IndexName: 'category-index',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new Product(item)) : [];
    } catch (error) {
      console.error('Error finding products by category:', error);
      throw error;
    }
  }

  // Update product
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

    // Always update the updatedAt field
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.PRODUCTS,
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
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.PRODUCTS,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Save (PutCommand)
  async save() {
    this.updatedAt = new Date().toISOString();
    const command = new PutCommand({
      TableName: TABLES.PRODUCTS,
      Item: this
    });

    try {
      await docClient.send(command);
      return this;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }
}

module.exports = Product;
