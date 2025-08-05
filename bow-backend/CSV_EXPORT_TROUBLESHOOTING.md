# CSV Export Troubleshooting Guide

## Issue: "Failed to export CSV file"

If you're getting this error when clicking the "Export CSV" button in the admin panel, follow these troubleshooting steps:

## Step 1: Check Backend Server Status

### 1.1 Verify Backend is Running
```bash
cd bow-backend
npm start
```

**Expected Output:**
```
Server running on port 3000
✅ Using DynamoDB Volunteer model
```

### 1.2 Check Server Health
Open your browser and go to: `http://localhost:3000/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-05T...",
  "environment": "production"
}
```

## Step 2: Test CSV Export Endpoint Directly

### 2.1 Using Browser
Navigate to: `http://localhost:3000/api/volunteers/export-csv`

**Expected Result:** File download starts automatically

### 2.2 Using Test Script
```bash
cd bow-backend
node test-csv-simple.js
```

**Expected Output:**
```
🧪 Testing CSV Export Endpoint...

📤 Testing endpoint: http://localhost:3000/api/volunteers/export-csv
📊 Response Status: 200
📊 Response OK: true
✅ CSV Export: SUCCESS!
📄 Content Length: 1234 characters
📄 Content Type: text/csv
📄 Filename: attachment; filename="volunteer-applications-2025-08-05.csv"

📋 First 3 lines:
   1: Application ID,Applicant Name,Applicant Email,Applicant Phone,Applicant Age,Opportunity Title,Opportunity Category,Status,Application Date,Time Commitment,Experience,Skills,Motivation,Availability,Emergency Contact Name,Emergency Contact Phone,Emergency Contact Relationship,Review Notes,Review Date
   2: app_1,"John Doe",john.doe@example.com,(206) 555-0123,28,"Event Coordinator",Events,pending,2025-08-05,"6 hours per event","Previous event planning experience","Organization, communication, leadership","Passionate about community building","Weekends and evenings","Mary Doe",(206) 555-0125,"Spouse","",
```

## Step 3: Check Browser Console

### 3.1 Open Developer Tools
1. Right-click on the page → "Inspect"
2. Go to "Console" tab
3. Click "Export CSV" button
4. Look for error messages

### 3.2 Common Console Messages

**✅ Success:**
```
🔄 Starting CSV export...
📊 Response status: 200
📊 Response ok: true
📄 Blob size: 1234 bytes
```

**❌ Network Error:**
```
🔄 Starting CSV export...
❌ Error exporting CSV: TypeError: Failed to fetch
Network error: Failed to fetch
```

**❌ Server Error:**
```
🔄 Starting CSV export...
📊 Response status: 500
📊 Response ok: false
❌ Failed to export CSV: 500 - {"error":"Failed to export applications to CSV"}
```

## Step 4: Check Backend Logs

### 4.1 Start Backend with Debug Logging
```bash
cd bow-backend
npm start
```

### 4.2 Expected Backend Logs (Success)
```
🔄 CSV Export Request Received
📊 Using sample data (DynamoDB not available)
📊 Using 1 sample applications
📄 Generating CSV content...
📄 CSV content generated: 1234 characters
📄 Setting headers for file: volunteer-applications-2025-08-05.csv
📄 Sending CSV response...
✅ CSV export completed successfully
```

### 4.3 Common Backend Errors

**❌ DynamoDB Connection Error:**
```
❌ Error exporting volunteer applications to CSV: Error: connect ECONNREFUSED
```

**❌ No Applications Found:**
```
❌ No applications found to export
```

## Step 5: Common Issues and Solutions

### 5.1 Backend Server Not Running
**Problem:** "Failed to fetch" error
**Solution:** Start the backend server
```bash
cd bow-backend
npm start
```

### 5.2 CORS Issues
**Problem:** Network error in browser
**Solution:** Check CORS configuration in `server.js`

### 5.3 No Volunteer Applications
**Problem:** "No applications found to export"
**Solution:** 
- Check if DynamoDB has volunteer applications
- Verify sample data is available
- Submit a test volunteer application

### 5.4 DynamoDB Connection Issues
**Problem:** Backend can't connect to DynamoDB
**Solution:**
- Check AWS credentials in `.env` file
- Verify DynamoDB table exists
- Check network connectivity

### 5.5 Browser Download Blocked
**Problem:** File doesn't download
**Solution:**
- Check browser download settings
- Allow popups for the site
- Try different browser

## Step 6: Manual Testing

### 6.1 Test with Sample Data
```bash
cd bow-backend
node -e "
const { createCSV } = require('./routes/volunteers');
const sampleApps = require('./routes/volunteers').sampleApplications;
console.log(createCSV(sampleApps));
"
```

### 6.2 Test API Endpoint
```bash
curl -X GET http://localhost:3000/api/volunteers/export-csv -H "Accept: text/csv" -o test.csv
```

## Step 7: Environment Check

### 7.1 Verify Environment Variables
```bash
cd bow-backend
cat .env
```

**Required Variables:**
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-west-2
```

### 7.2 Check Node.js Version
```bash
node --version
```
**Recommended:** Node.js 16+ or 18+

## Step 8: Reset and Retry

### 8.1 Restart Backend
```bash
cd bow-backend
npm start
```

### 8.2 Clear Browser Cache
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache and cookies

### 8.3 Test in Incognito Mode
- Open browser in incognito/private mode
- Navigate to admin panel
- Try CSV export

## Step 9: Advanced Debugging

### 9.1 Enable Detailed Logging
Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### 9.2 Check Network Tab
1. Open Developer Tools → Network tab
2. Click "Export CSV"
3. Look for the request to `/api/volunteers/export-csv`
4. Check response status and content

## Step 10: Contact Support

If none of the above steps resolve the issue:

1. **Collect Information:**
   - Browser console errors
   - Backend server logs
   - Network tab response
   - Environment details

2. **Test Steps Taken:**
   - List all troubleshooting steps attempted
   - Note any error messages received

3. **System Information:**
   - Operating system
   - Browser version
   - Node.js version
   - Backend server status

## Quick Fix Checklist

- [ ] Backend server running on port 3000
- [ ] Health endpoint responding: `http://localhost:3000/api/health`
- [ ] CSV endpoint accessible: `http://localhost:3000/api/volunteers/export-csv`
- [ ] Browser console shows no errors
- [ ] Network tab shows successful request
- [ ] File download not blocked by browser
- [ ] Sample data available in backend
- [ ] AWS credentials configured (if using DynamoDB) 