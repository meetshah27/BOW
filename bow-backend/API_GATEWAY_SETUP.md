# API Gateway Setup Guide

## Step 1: Create REST API

On the API Gateway page, fill in these fields:

### API Details:
- **New API**: Select "New API" (already selected)
- **API name**: Enter `bow-backend-api` (or any name you prefer)
- **Description**: Optional - "Beats of Washington Backend API"
- **API endpoint type**: Select **Regional** (recommended for Lambda)
- **IP address type**: Select **IPv4** (sufficient for most use cases)

Click **Create API**

---

## Step 2: Create API Resource and Method

After API is created:

### A. Create Resource
1. Click **Actions** → **Create Resource**
2. **Resource Name**: `{proxy+}` (this catches all paths)
3. **Resource Path**: `{proxy+}` (should auto-fill)
4. ✅ Check **Enable API Gateway CORS**
5. Click **Create Resource**

### B. Create Method
1. Select the `{proxy+}` resource
2. Click **Actions** → **Create Method**
3. Select **ANY** from dropdown (handles all HTTP methods)
4. Click the checkmark ✓

### C. Configure Integration
1. **Integration type**: Lambda Function
2. ✅ Check **Use Lambda Proxy integration**
3. **Lambda Region**: Select your region (us-west-2)
4. **Lambda Function**: Select your Lambda function name
5. Click **Save**
6. Click **OK** when prompted to give API Gateway permission

---

## Step 3: Enable CORS (Important!)

1. Select the `{proxy+}` resource
2. Click **Actions** → **Enable CORS**
3. Leave defaults or configure:
   - **Access-Control-Allow-Origin**: `*` (or your frontend domain)
   - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
4. Click **Enable CORS and replace existing CORS headers**

---

## Step 4: Deploy the API

1. Click **Actions** → **Deploy API**
2. **Deployment stage**: Select **[New Stage]** (or use existing)
3. **Stage name**: `prod` (or `dev` for development)
4. **Stage description**: Optional
5. **Deployment description**: Optional
6. Click **Deploy**

---

## Step 5: Get Your API Endpoint URL

After deployment:
1. You'll see the **Invoke URL** (e.g., `https://xxxxx.execute-api.us-west-2.amazonaws.com/prod`)
2. **Copy this URL** - you'll need it for your frontend!

Your API will be available at:
- Base URL: `https://xxxxx.execute-api.us-west-2.amazonaws.com/prod`
- Full endpoint: `https://xxxxx.execute-api.us-west-2.amazonaws.com/prod/api/events` (for example)

---

## Step 6: Update Frontend Configuration

After getting your API endpoint URL, update `bow-platform/src/config/api.js`:

```javascript
production: {
  baseURL: process.env.REACT_APP_API_URL || 'https://YOUR-API-ID.execute-api.us-west-2.amazonaws.com/prod',
  apiPath: '/api'
}
```

---

## Troubleshooting

### CORS Errors
- Make sure CORS is enabled on the `{proxy+}` resource
- Check that your frontend domain is allowed in CORS settings

### 403 Forbidden
- Check Lambda function permissions
- Verify API Gateway has permission to invoke Lambda

### 502 Bad Gateway
- Check Lambda function logs
- Verify Lambda handler is correct: `lambda.handler`

### Method Not Allowed
- Make sure you created the `{proxy+}` resource with `ANY` method
- This catches all HTTP methods and paths

---

## Alternative: Root Resource Setup

If you want to handle root path separately:

1. Create root method (on `/` resource):
   - Method: `ANY`
   - Integration: Lambda Function with proxy integration
   
2. Create proxy resource:
   - Resource: `{proxy+}`
   - Method: `ANY`
   - Integration: Lambda Function with proxy integration

This allows both `/` and `/api/*` to work.

