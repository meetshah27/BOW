const { PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class VendorApplication {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.applicantName = data.applicantName;
    this.applicantEmail = data.applicantEmail;
    this.applicantPhone = data.applicantPhone || '';

    this.businessName = data.businessName || '';
    this.businessType = data.businessType || '';
    this.website = data.website || '';
    this.socialLinks = data.socialLinks || '';
    this.productsDescription = data.productsDescription || '';
    this.notes = data.notes || '';

    this.status = data.status || 'pending';
    this.applicationDate = data.applicationDate || new Date().toISOString();
    this.reviewDate = data.reviewDate || null;
    this.reviewNotes = data.reviewNotes || null;
  }

  static async create(applicationData) {
    const application = new VendorApplication(applicationData);

    if (!application.applicantName || !application.applicantEmail) {
      throw new Error('applicantName and applicantEmail are required');
    }

    const command = new PutCommand({
      TableName: TABLES.VENDOR_APPLICATIONS,
      Item: application,
    });

    await docClient.send(command);
    return application;
  }

  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLES.VENDOR_APPLICATIONS,
    });

    const result = await docClient.send(command);
    return (result.Items || []).map((item) => new VendorApplication(item));
  }

  static async updateStatusByKey(applicantEmail, id, { status, reviewNotes }) {
    if (!id) throw new Error('id is required');

    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: TABLES.VENDOR_APPLICATIONS,
      Key: { id },
      UpdateExpression: 'SET #status = :status, #reviewNotes = :reviewNotes, #reviewDate = :reviewDate',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#reviewNotes': 'reviewNotes',
        '#reviewDate': 'reviewDate',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':reviewNotes': reviewNotes || '',
        ':reviewDate': now,
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    return result.Attributes ? new VendorApplication(result.Attributes) : null;
  }

  static async deleteByKey(applicantEmail, id) {
    if (!id) throw new Error('id is required');
    const command = new DeleteCommand({
      TableName: TABLES.VENDOR_APPLICATIONS,
      Key: { id },
    });
    await docClient.send(command);
    return true;
  }
}

module.exports = VendorApplication;

