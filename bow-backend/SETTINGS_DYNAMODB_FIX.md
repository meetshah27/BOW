# Settings DynamoDB Persistence Fix

## Problem
The member application enable/disable button in the Admin Settings was not working because settings were stored in-memory. This meant:
- Settings were lost on Lambda cold starts
- Settings were not shared across multiple Lambda instances
- Changes were not persistent

## Solution
Converted settings storage from in-memory to DynamoDB for persistent, reliable storage.

## Changes Made

### 1. Added SETTINGS Table to DynamoDB Config
- **File**: `bow-backend/config/dynamodb.js`
- Added `SETTINGS: 'bow-settings'` to `TABLES` object
- Added table schema for `bow-settings` table

### 2. Created Settings DynamoDB Model
- **File**: `bow-backend/models-dynamodb/Settings.js`
- New model class with methods:
  - `getSettings()` - Get application settings (creates default if none exist)
  - `save()` - Save settings to DynamoDB
  - `update(updates)` - Update settings in DynamoDB
  - `delete()` - Delete settings from DynamoDB

### 3. Updated Settings Route
- **File**: `bow-backend/routes/settings.js`
- Converted all endpoints to use DynamoDB:
  - `GET /api/settings` - Gets settings from DynamoDB
  - `GET /api/settings/:key` - Gets specific setting from DynamoDB
  - `PUT /api/settings` - Updates settings in DynamoDB
  - `PUT /api/settings/membership-application` - Toggles membership application setting in DynamoDB

### 4. Created Table Creation Script
- **File**: `bow-backend/create-settings-table.js`
- Script to create the `bow-settings` DynamoDB table

## Deployment Steps

### Step 1: Create DynamoDB Table

Before deploying Lambda, create the settings table:

```bash
cd bow-backend
node create-settings-table.js
```

Or manually create in AWS Console:
- Table name: `bow-settings`
- Partition key: `id` (String)
- Provisioned throughput: 5 read, 5 write capacity units

### Step 2: Deploy Lambda Function

Package and deploy the updated Lambda function:

```bash
cd bow-backend
npm run package-lambda
# Then upload the lambda-deployment.zip to AWS Lambda
```

Or use your existing deployment method.

### Step 3: Verify IAM Permissions

Ensure your Lambda execution role has permissions for DynamoDB:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
    "dynamodb:Query",
    "dynamodb:Scan"
  ],
  "Resource": "arn:aws:dynamodb:us-west-2:*:table/bow-settings"
}
```

### Step 4: Test

1. Access the Admin Panel → Settings
2. Toggle the "Membership Application" enable/disable button
3. Refresh the page - the setting should persist
4. Restart Lambda (or wait for cold start) - the setting should still persist

## Default Settings

When the table is first accessed, default settings are created:
- `membershipApplicationEnabled: true`
- `lastUpdated: [current timestamp]`
- `updatedBy: 'system'`

## API Endpoints

### GET `/api/settings`
Returns all application settings.

**Response:**
```json
{
  "success": true,
  "settings": {
    "membershipApplicationEnabled": true,
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "updatedBy": "admin"
  }
}
```

### PUT `/api/settings/membership-application`
Toggles the membership application setting.

**Request:**
```json
{
  "enabled": false,
  "updatedBy": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Membership application disabled successfully",
  "settings": {
    "membershipApplicationEnabled": false,
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "updatedBy": "admin"
  }
}
```

## Notes

- Settings are now persistent across Lambda cold starts
- Settings are shared across all Lambda instances
- The table will be automatically initialized with default values on first access
- All settings operations are now async and use DynamoDB






