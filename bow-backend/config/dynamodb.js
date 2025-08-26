// Import enhanced AWS configuration
const { docClient, dynamoClient } = require('./aws-config');

// Legacy client reference for backward compatibility
const client = dynamoClient;

// Table definitions
const TABLES = {
  USERS: 'bow-users',
  EVENTS: 'bow-events',
  STORIES: 'bow-stories',
  FOUNDERS: 'bow-founders',
  DONATIONS: 'bow-donations',
  REGISTRATIONS: 'bow-registrations',
  VOLUNTEERS: 'bow-volunteers',
  GALLERY: 'bow-gallery',
  HERO: 'bow-hero',
  MISSION_MEDIA: 'bow-mission-media',
  ABOUT_PAGE: 'bow-about-page',
  FOUNDER_CONTENT: 'bow-founder-content'
};

// Table schemas for creation
const TABLE_SCHEMAS = {
  [TABLES.USERS]: {
    TableName: TABLES.USERS,
    KeySchema: [
      { AttributeName: 'uid', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'uid', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.EVENTS]: {
    TableName: TABLES.EVENTS,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'category-date-index',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' },
          { AttributeName: 'date', KeyType: 'RANGE' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.STORIES]: {
    TableName: TABLES.STORIES,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.FOUNDERS]: {
    TableName: TABLES.FOUNDERS,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.DONATIONS]: {
    TableName: TABLES.DONATIONS,
    KeySchema: [
      { AttributeName: 'paymentIntentId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'paymentIntentId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.REGISTRATIONS]: {
    TableName: TABLES.REGISTRATIONS,
    KeySchema: [
      { AttributeName: 'eventId', KeyType: 'HASH' },
      { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'eventId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.VOLUNTEERS]: {
    TableName: TABLES.VOLUNTEERS,
    KeySchema: [
      { AttributeName: 'opportunityId', KeyType: 'HASH' },
      { AttributeName: 'applicantEmail', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'opportunityId', AttributeType: 'S' },
      { AttributeName: 'applicantEmail', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.GALLERY]: {
    TableName: TABLES.GALLERY,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.HERO]: {
    TableName: TABLES.HERO,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.MISSION_MEDIA]: {
    TableName: TABLES.MISSION_MEDIA,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.ABOUT_PAGE]: {
    TableName: TABLES.ABOUT_PAGE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  [TABLES.FOUNDER_CONTENT]: {
    TableName: TABLES.FOUNDER_CONTENT,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

module.exports = {
  docClient,
  TABLES,
  TABLE_SCHEMAS
}; 