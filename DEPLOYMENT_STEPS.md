# Complete Deployment Steps

## Step 1: Deploy Backend to Lambda (Do This First!)

### A. Upload Lambda Function

1. Go to **AWS Lambda Console** → Create function (or select existing)
2. Upload `bow-backend/bow-backend-lambda.zip`
3. Configure:
   - **Handler**: `lambda.handler`
   - **Runtime**: Node.js 18.x or 20.x
   - **Timeout**: 60 seconds
   - **Memory**: 1024 MB

### B. Set Environment Variables

Lambda → Configuration → Environment variables:
```
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
NODE_ENV=production
```

### C. Create Function URL (Recommended - Simplest)

1. Lambda → Configuration → Function URL
2. Click **Create function URL**
3. **Auth type**: NONE (or AWS_IAM for security)
4. Copy the Function URL (e.g., `https://xxxxx.lambda-url.us-west-2.on.aws/`)

### Alternative: API Gateway (More Control)

If you prefer API Gateway:
1. Create REST API in API Gateway
2. Create resource and method
3. Integrate with Lambda function
4. Deploy API
5. Get the API endpoint URL

**Save the URL you get - you'll need it for the frontend!**

---

## Step 2: Update Frontend Configuration

After getting your Lambda Function URL or API Gateway URL:

### Option A: Update code (Recommended)

Edit `bow-platform/src/config/api.js` line 10:
```javascript
production: {
  baseURL: process.env.REACT_APP_API_URL || 'YOUR_LAMBDA_FUNCTION_URL_HERE',
  apiPath: '/api'
}
```

### Option B: Use Environment Variable (Better for CI/CD)

Create `.env.production` in `bow-platform/`:
```
REACT_APP_API_URL=https://your-lambda-function-url.lambda-url.us-west-2.on.aws
```

---

## Step 3: Deploy Frontend to Amplify

### A. Build Frontend

```bash
cd bow-platform
npm run build
```

### B. Deploy to Amplify

**Option 1: Amplify Console (Recommended)**
1. Go to AWS Amplify Console
2. Connect your repository (GitHub/GitLab/Bitbucket)
3. Amplify will automatically:
   - Detect it's a React app
   - Run `npm install` and `npm run build`
   - Deploy the `build/` folder

**Option 2: Manual Deploy**
1. Amplify Console → Your App → Hosting
2. Choose "Deploy without Git provider"
3. Drag and drop the `build/` folder contents
4. Deploy

---

## Quick Decision Guide

**Use Lambda Function URL if:**
- ✅ You want the simplest setup
- ✅ You don't need custom domain mapping
- ✅ You don't need API Gateway features (rate limiting, caching, etc.)

**Use API Gateway if:**
- ✅ You need a custom domain
- ✅ You want rate limiting, caching, or request validation
- ✅ You need more advanced API management features

---

## Testing After Deployment

1. Test backend: Visit `YOUR_LAMBDA_FUNCTION_URL/health`
2. Test frontend: Visit your Amplify app URL
3. Check browser console for API connection errors
4. Verify API calls are going to the correct backend URL

Front-end Deployment (Amplify)

- Ensure the Amplify CLI is configured (run `amplify configure` once).
- In `bow-platform`, build the React bundle:
  ```
  npm run build
  ```
- Publish the updated bundle and invalidate CloudFront cache so the latest assets go live immediately:
  ```
  amplify publish --invalidateCloudFront true
  ```

