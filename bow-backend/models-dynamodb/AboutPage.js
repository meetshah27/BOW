const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} = require('@aws-sdk/lib-dynamodb');
const { TABLES } = require('../config/dynamodb');

const docClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

class AboutPage {
  constructor(data = {}) {
    this.id = data.id || 'about-page-settings';
    this.storyTitle = data.storyTitle || 'Our Story';
    this.storySubtitle = data.storySubtitle || 'From humble beginnings to a statewide movement, here\'s how BOW has grown and evolved over the years.';
    this.foundingYear = data.foundingYear || '2019';
    this.foundingTitle = data.foundingTitle || 'Founded in 2019';
    this.foundingDescription = data.foundingDescription || 'Beats of Washington was founded by Aand Sane and Deepali Sane, visionary community leaders who recognized the power of music to bring people together. What started as a small neighborhood drum circle has grown into one of Washington State\'s most impactful community organizations.';
    this.founderBelief = data.founderBelief || 'Our founders believed that music transcends barriers of language, culture, and background, creating opportunities for genuine connection and understanding between diverse communities.';
    this.todayVision = data.todayVision || 'Today, we continue to honor that vision while adapting to meet the evolving needs of our communities through innovative programming and partnerships.';
    this.achievements = data.achievements || [
      {
        year: '2019',
        title: 'Foundation Established',
        description: 'BOW was founded with a vision of community building through music.'
      },
      {
        year: '2020',
        title: 'First Community Event',
        description: 'Successfully organized our first major community music festival.'
      },
      {
        year: '2021',
        title: 'Statewide Expansion',
        description: 'Extended programs to multiple cities across Washington State.'
      },
      {
        year: '2022',
        title: 'Cultural Partnerships',
        description: 'Formed partnerships with diverse cultural organizations.'
      },
      {
        year: '2023',
        title: 'Digital Innovation',
        description: 'Launched online programs and virtual community events.'
      },
      {
        year: '2024',
        title: 'Community Impact',
        description: 'Reached over 50,000 community members across the state.'
      }
    ];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Get about page settings
  static async getSettings() {
    const command = new GetCommand({
      TableName: TABLES.ABOUT_PAGE,
      Key: { id: 'about-page-settings' }
    });

    try {
      const result = await docClient.send(command);
      if (result.Item) {
        return new AboutPage(result.Item);
      }
      // Return default settings if none exist
      return new AboutPage();
    } catch (error) {
      console.error('Error getting about page settings:', error);
      throw error;
    }
  }

  // Save about page settings
  async save() {
    const command = new PutCommand({
      TableName: TABLES.ABOUT_PAGE,
      Item: {
        id: this.id,
        storyTitle: this.storyTitle,
        storySubtitle: this.storySubtitle,
        foundingYear: this.foundingYear,
        foundingTitle: this.foundingTitle,
        foundingDescription: this.foundingDescription,
        founderBelief: this.founderBelief,
        todayVision: this.todayVision,
        achievements: this.achievements,
        isActive: this.isActive,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      await docClient.send(command);
      return this;
    } catch (error) {
      console.error('Error saving about page settings:', error);
      throw error;
    }
  }

  // Update about page settings
  async update(updates) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && updates[key] !== undefined) {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
      }
    });

    if (updateExpression.length === 0) return this;

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLES.ABOUT_PAGE,
      Key: { id: this.id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    try {
      const result = await docClient.send(command);
      Object.assign(this, result.Attributes);
      return this;
    } catch (error) {
      console.error('Error updating about page settings:', error);
      throw error;
    }
  }

  // Delete about page settings
  async delete() {
    const command = new DeleteCommand({
      TableName: TABLES.ABOUT_PAGE,
      Key: { id: this.id }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting about page settings:', error);
      throw error;
    }
  }

  // Get all about page settings (for admin panel)
  static async getAll() {
    const command = new ScanCommand({
      TableName: TABLES.ABOUT_PAGE
    });

    try {
      const result = await docClient.send(command);
      return result.Items ? result.Items.map(item => new AboutPage(item)) : [];
    } catch (error) {
      console.error('Error getting all about page settings:', error);
      throw error;
    }
  }
}

module.exports = AboutPage;
