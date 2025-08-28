# Stories Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to save story" Error

#### Symptoms
- Error message: "Failed to save story"
- Form submission fails
- No story is created/updated

#### Possible Causes
1. **Authentication Required**: The main endpoints require Cognito authentication
2. **Backend Server Not Running**: Backend server is down or not accessible
3. **Database Connection Issues**: DynamoDB connection problems
4. **Invalid Data Format**: Form data doesn't match expected schema

#### Solutions

##### A. Use Test Endpoints (Temporary Solution)
The system now includes test endpoints that bypass authentication:

- **Create Story**: `POST /api/stories/test`
- **Update Story**: `PUT /api/stories/test/:id`
- **Delete Story**: `DELETE /api/stories/test/:id`

These are automatically used by the frontend when testing.

##### B. Check Backend Server
1. Ensure backend server is running:
   ```bash
   cd bow-backend
   npm start
   # or
   node server.js
   ```

2. Check server logs for errors

##### C. Test Backend Endpoints
Run the backend test script:
```bash
cd bow-backend
node test-stories-backend.js
```

##### D. Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages and API responses
4. Check Network tab for failed requests

### 2. Media Upload Failures

#### Symptoms
- Files don't upload
- "Upload failed" error messages
- Media not displaying after upload

#### Solutions

##### A. Check File Types
Supported formats:
- **Images**: JPEG, PNG, GIF, WebP
- **Videos**: MP4, MOV, AVI, WebM

##### B. Check File Size
Maximum file size: 50MB

##### C. Check S3 Configuration
1. Verify AWS credentials in `bow-backend/config/s3.js`
2. Check S3 bucket permissions
3. Ensure bucket exists and is accessible

##### D. Test Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/upload/story \
  -F "media=@test-image.jpg"
```

### 3. Stories Not Loading

#### Symptoms
- Stories page shows "Loading..." indefinitely
- Empty stories list
- Error messages about failed API calls

#### Solutions

##### A. Check API Endpoints
1. Test stories endpoint:
   ```bash
   curl http://localhost:3000/api/stories
   ```

2. Check if backend is responding

##### B. Check Database
1. Verify DynamoDB connection
2. Check if stories table exists
3. Verify table permissions

##### C. Check Network Requests
1. Open browser dev tools
2. Go to Network tab
3. Look for failed requests to `/api/stories`
4. Check response status codes

### 4. Form Validation Issues

#### Symptoms
- Form won't submit
- Required fields not working
- Validation errors not showing

#### Solutions

##### A. Check Required Fields
Ensure these fields are filled:
- Title (required)
- Author (required)
- Content (required)

##### B. Check Form State
1. Open browser console
2. Look for form field update logs
3. Verify form state is being updated

##### C. Check Form Submission
1. Look for console logs during submission
2. Check if `handleSave` function is called
3. Verify form data in payload

## Debug Steps

### Step 1: Check Backend Status
```bash
cd bow-backend
npm start
# Check for any startup errors
```

### Step 2: Test Backend Endpoints
```bash
cd bow-backend
node test-stories-backend.js
```

### Step 3: Check Frontend Console
1. Open browser dev tools
2. Go to Console tab
3. Look for error messages
4. Check form submission logs

### Step 4: Test API Endpoints
```bash
# Test stories endpoint
curl http://localhost:3000/api/stories

# Test upload endpoint
curl -X POST http://localhost:3000/api/upload/story \
  -F "media=@test-file.jpg"
```

### Step 5: Check Network Requests
1. Open browser dev tools
2. Go to Network tab
3. Submit a story form
4. Look for failed requests
5. Check response details

## Common Error Messages

### "Failed to save story"
- **Cause**: Authentication required or backend error
- **Solution**: Use test endpoints or check backend logs

### "Upload failed"
- **Cause**: File type/size issue or S3 error
- **Solution**: Check file format/size and S3 configuration

### "Stories not found"
- **Cause**: Database connection issue or empty table
- **Solution**: Check DynamoDB connection and table data

### "Network error"
- **Cause**: Backend server not running
- **Solution**: Start backend server

## Testing Checklist

- [ ] Backend server is running
- [ ] Database connection is working
- [ ] API endpoints are accessible
- [ ] File uploads are working
- [ ] Form validation is working
- [ ] Stories can be created/updated/deleted
- [ ] Media is displaying correctly
- [ ] Frontend is responsive

## Getting Help

If you're still experiencing issues:

1. **Check this troubleshooting guide first**
2. **Run the test scripts** to identify the problem
3. **Check browser console** for error messages
4. **Check backend logs** for server errors
5. **Provide specific error messages** when asking for help

## Quick Fix Commands

```bash
# Restart backend server
cd bow-backend
npm start

# Test backend endpoints
node test-stories-backend.js

# Check server logs
tail -f logs/server.log
```

---

**Remember**: The test endpoints bypass authentication for development purposes. In production, you'll need to implement proper authentication.
