const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const dynamodb = DynamoDBDocumentClient.from(dynamodbClient);

class Leader {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    this.position = data.position || '';
    this.roles = data.roles || [];
    this.bio = data.bio || '';
    this.imageUrl = data.imageUrl || '';
    this.imageKey = data.imageKey || '';
    this.isActive = data.isActive !== undefined ? data.isActive : 'true';
    this.order = data.order || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Create a new leader
  static async create(leaderData) {
    const leader = new Leader(leaderData);
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      Item: leader
    };

    try {
      const putCommand = new PutCommand(params);
      await dynamodb.send(putCommand);
      return leader;
    } catch (error) {
      console.error('Error creating leader:', error);
      throw error;
    }
  }

  // Get all active leaders
  static async getAll() {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      FilterExpression: 'isActive = :isActive',
      ExpressionAttributeValues: {
        ':isActive': 'true'
      }
    };

    try {
      const scanCommand = new ScanCommand(params);
      const result = await dynamodb.send(scanCommand);
      return result.Items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error getting leaders:', error);
      throw error;
    }
  }

  // Get all leaders (including inactive) for admin
  static async getAllForAdmin() {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders'
    };

    try {
      const scanCommand = new ScanCommand(params);
      const result = await dynamodb.send(scanCommand);
      return result.Items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error getting all leaders for admin:', error);
      throw error;
    }
  }

  // Get leader by ID
  static async getById(id) {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      Key: { id }
    };

    try {
      const getCommand = new GetCommand(params);
      const result = await dynamodb.send(getCommand);
      return result.Item;
    } catch (error) {
      console.error('Error getting leader by ID:', error);
      throw error;
    }
  }

  // Update leader
  static async update(id, updateData) {
    const updateDataWithTimestamp = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateDataWithTimestamp).forEach(key => {
      if (key !== 'id') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateDataWithTimestamp[key];
      }
    });

    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    try {
      const updateCommand = new UpdateCommand(params);
      const result = await dynamodb.send(updateCommand);
      return result.Attributes;
    } catch (error) {
      console.error('Error updating leader:', error);
      throw error;
    }
  }

  // Delete leader
  static async delete(id) {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      Key: { id }
    };

    try {
      const deleteCommand = new DeleteCommand(params);
      await dynamodb.send(deleteCommand);
      return { success: true };
    } catch (error) {
      console.error('Error deleting leader:', error);
      throw error;
    }
  }

  // Toggle leader active status
  static async toggleActive(id) {
    try {
      const leader = await this.getById(id);
      if (!leader) {
        throw new Error('Leader not found');
      }

      const newStatus = leader.isActive === 'true' ? 'false' : 'true';
      return await this.update(id, { isActive: newStatus });
    } catch (error) {
      console.error('Error toggling leader active status:', error);
      throw error;
    }
  }

  // Update leader order
  static async updateOrder(id, newOrder) {
    try {
      return await this.update(id, { order: newOrder });
    } catch (error) {
      console.error('Error updating leader order:', error);
      throw error;
    }
  }

  // Search leaders by name or position
  static async search(query) {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      FilterExpression: 'isActive = :isActive AND (contains(#name, :query) OR contains(#position, :query))',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#position': 'position'
      },
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':query': query
      }
    };

    try {
      const scanCommand = new ScanCommand(params);
      const result = await dynamodb.send(scanCommand);
      return result.Items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error searching leaders:', error);
      throw error;
    }
  }

  // Get leaders by position
  static async getByPosition(position) {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      FilterExpression: 'isActive = :isActive AND #position = :position',
      ExpressionAttributeNames: {
        '#position': 'position'
      },
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':position': position
      }
    };

    try {
      const scanCommand = new ScanCommand(params);
      const result = await dynamodb.send(scanCommand);
      return result.Items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error getting leaders by position:', error);
      throw error;
    }
  }

  // Get leaders by role
  static async getByRole(role) {
    const params = {
      TableName: process.env.LEADERS_TABLE || 'Leaders',
      FilterExpression: 'isActive = :isActive AND contains(#roles, :role)',
      ExpressionAttributeNames: {
        '#roles': 'roles'
      },
      ExpressionAttributeValues: {
        ':isActive': 'true',
        ':role': role
      }
    };

    try {
      const scanCommand = new ScanCommand(params);
      const result = await dynamodb.send(scanCommand);
      return result.Items.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error getting leaders by role:', error);
      throw error;
    }
  }

  // Get leader statistics
  static async getStats() {
    try {
      const allLeaders = await this.getAllForAdmin();
      const activeLeaders = allLeaders.filter(leader => leader.isActive === 'true');
      const totalLeaders = allLeaders.length;
      const activeCount = activeLeaders.length;
      const inactiveCount = totalLeaders - activeCount;

      // Get unique positions
      const positions = [...new Set(allLeaders.map(leader => leader.position))];
      
      // Get unique roles
      const allRoles = allLeaders.reduce((roles, leader) => {
        if (leader.roles && Array.isArray(leader.roles)) {
          roles.push(...leader.roles);
        }
        return roles;
      }, []);
      const uniqueRoles = [...new Set(allRoles)];

      return {
        totalLeaders,
        activeCount,
        inactiveCount,
        positions,
        uniqueRoles
      };
    } catch (error) {
      console.error('Error getting leader statistics:', error);
      throw error;
    }
  }
}

module.exports = Leader;
