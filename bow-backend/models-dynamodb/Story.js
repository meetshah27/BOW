const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Story {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.author = data.author;
    this.authorImage = data.authorImage || '/assets/default-author.jpg';
    this.category = data.category || 'Community';
    this.image = data.image || '/assets/default-story.jpg';
    this.excerpt = data.excerpt;
    this.content = data.content;
    this.date = data.date || new Date().toISOString();
    this.readTime = data.readTime || '5 min read';
    this.tags = data.tags || [];
    this.likes = data.likes || 0;
    this.comments = data.comments || 0;
    this.featured = data.featured || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new story
  static async create(storyData) {
    const story = new Story(storyData);
    const command = new PutCommand({
      TableName: TABLES.STORIES,
      Item: story
    });

    try {
      await docClient.send(command);
      return story;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  // Get story by ID
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLES.STORIES,
      Key: { id }
    });

    try {
      const result = await docClient.send(command);
      return result.Item ? new Story(result.Item) : null;
    } catch (error) {
      console.error('Error finding story by ID:', error);
      throw error;
    }
  }

  // Update story
  async update(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') { // Don't allow updating ID
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
      TableName: TABLES.STORIES,
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
      console.error('Error updating story:', error);
      throw error;
    }
  }

  // Delete story
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.STORIES,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  // Get all stories
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.STORIES
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Story(item));
    } catch (error) {
      console.error('Error finding all stories:', error);
      throw error;
    }
  }

  // Find stories by category
  static async findByCategory(category) {
    const command = new ScanCommand({
      TableName: TABLES.STORIES,
      FilterExpression: '#category = :category',
      ExpressionAttributeNames: {
        '#category': 'category'
      },
      ExpressionAttributeValues: {
        ':category': category
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Story(item));
    } catch (error) {
      console.error('Error finding stories by category:', error);
      throw error;
    }
  }

  // Find featured stories
  static async findFeatured() {
    const command = new ScanCommand({
      TableName: TABLES.STORIES,
      FilterExpression: '#featured = :featured',
      ExpressionAttributeNames: {
        '#featured': 'featured'
      },
      ExpressionAttributeValues: {
        ':featured': true
      }
    });

    try {
      const result = await docClient.send(command);
      return result.Items.map(item => new Story(item));
    } catch (error) {
      console.error('Error finding featured stories:', error);
      throw error;
    }
  }

  // Increment likes
  async incrementLikes() {
    const command = new UpdateCommand({
      TableName: TABLES.STORIES,
      Key: { id: this.id },
      UpdateExpression: 'SET likes = likes + :inc, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error incrementing likes:', error);
      throw error;
    }
  }

  // Increment comments
  async incrementComments() {
    const command = new UpdateCommand({
      TableName: TABLES.STORIES,
      Key: { id: this.id },
      UpdateExpression: 'SET comments = comments + :inc, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error incrementing comments:', error);
      throw error;
    }
  }
}

module.exports = Story; 