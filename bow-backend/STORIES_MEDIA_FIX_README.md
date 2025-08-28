# Stories Media Persistence Fix

## Problem Description
The stories page media (images/videos) was disappearing after server restarts because the data was stored in **in-memory storage** instead of persistent storage.

## Root Cause
- Stories media data was stored in server memory using a JavaScript object
- When the server restarted, all in-memory data was lost
- Images/videos were uploaded to S3 successfully, but metadata (URLs, titles, descriptions) was not persisted
- No DynamoDB table existed for stories media

## Solution Implemented

### 1. Created DynamoDB Model
- **File**: `models-dynamodb/StoriesMedia.js`
- **Purpose**: Persistent storage for stories media data
- **Features**: CRUD operations with fallback to in-memory storage

### 2. Added DynamoDB Table Configuration
- **File**: `config/dynamodb.js`
- **Table**: `bow-stories-media`
- **Key**: `id` (partition key, always "stories-media-singleton")

### 3. Updated API Routes
- **File**: `routes/stories-media.js`
- **Changes**: 
  - Uses DynamoDB when available
  - Falls back to in-memory storage if DynamoDB fails
  - Maintains backward compatibility

### 4. Setup Scripts
- **File**: `setup-stories-media.js` - Complete setup
- **File**: `create-stories-media-table.js` - Table creation only
- **File**: `seed-stories-media.js` - Data seeding only

## How to Apply the Fix

### Option 1: Complete Setup (Recommended)
```bash
cd bow-backend
node setup-stories-media.js
```

### Option 2: Step by Step
```bash
cd bow-backend

# Step 1: Create the table
node create-stories-media-table.js

# Step 2: Seed with default data
node seed-stories-media.js
```

### Option 3: Manual Setup
1. Create DynamoDB table `bow-stories-media` with partition key `id` (String)
2. Restart the backend server
3. The system will automatically create default data on first access

## What This Fixes

✅ **Media Persistence**: Images/videos remain visible after server restarts
✅ **Data Durability**: All stories media metadata is stored in DynamoDB
✅ **Backward Compatibility**: Falls back to in-memory storage if DynamoDB fails
✅ **Automatic Recovery**: Creates default data if table doesn't exist

## How It Works

1. **Upload Flow**:
   - User uploads image/video from admin panel
   - File is uploaded to S3
   - Metadata is saved to DynamoDB
   - Stories page displays the media

2. **Persistence Flow**:
   - Server restarts
   - Stories media route loads data from DynamoDB
   - Media remains visible on stories page
   - No data loss occurs

3. **Fallback Flow**:
   - If DynamoDB is unavailable, uses in-memory storage
   - Maintains functionality even during AWS issues
   - Graceful degradation

## Testing the Fix

1. **Upload Media**: Go to admin panel → Stories Management → Upload image/video
2. **Verify Display**: Check that media appears on stories page
3. **Restart Server**: Stop and start the backend server
4. **Verify Persistence**: Media should still be visible after restart

## Troubleshooting

### Table Creation Fails
- Check AWS credentials and permissions
- Ensure DynamoDB service is available in your region
- Verify table name doesn't conflict with existing tables

### Data Not Loading
- Check DynamoDB table exists and is active
- Verify the table has the correct schema
- Check server logs for DynamoDB errors

### Fallback Mode
- If DynamoDB fails, the system automatically uses in-memory storage
- Check server logs for fallback messages
- This maintains functionality but data won't persist across restarts

## Files Modified

- `models-dynamodb/StoriesMedia.js` - New DynamoDB model
- `config/dynamodb.js` - Added STORIES_MEDIA table configuration
- `routes/stories-media.js` - Updated to use persistent storage
- `create-stories-media-table.js` - Table creation script
- `seed-stories-media.js` - Data seeding script
- `setup-stories-media.js` - Complete setup script

## Benefits

🎯 **Permanent Fix**: Media will never disappear again
🔄 **Server Restart Safe**: Data persists across all server operations
📊 **Scalable**: DynamoDB handles growth and concurrent access
🛡️ **Reliable**: Fallback mechanisms ensure continued operation
📱 **User Experience**: Consistent media display for all users

## Next Steps

After applying this fix:
1. Test by uploading new media
2. Restart the server to verify persistence
3. Monitor logs for any DynamoDB-related issues
4. Consider applying similar patterns to other in-memory data

---

**Note**: This fix ensures that once you upload media through the admin panel, it will remain visible on the stories page even after restarting the website/server.
