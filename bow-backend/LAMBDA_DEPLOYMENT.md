# Lambda Deployment Guide

## Quick Deployment

### Step 1: Package Backend for Lambda

```bash
cd bow-backend
npm run package-lambda
```

This will:
- Create a `lambda-deploy` directory with all necessary files
- Install production dependencies only
- Create `bow-backend-lambda.zip` file

### Step 2: Upload to Lambda

1. Go to AWS Lambda Console
2. Create a new function or select existing one
3. Upload the zip file: `bow-backend-lambda.zip`
4. Set handler to: `lambda.handler`
5. Set runtime to: Node.js 18.x or 20.x
6. Set timeout to at least 30 seconds (recommended: 60 seconds)
7. Set memory to at least 512 MB (recommended: 1024 MB)

### Step 3: Configure Environment Variables

In Lambda → Configuration → Environment variables, add:
- `AWS_REGION` (e.g., `us-west-2`)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- Any other environment variables from your `.env` file

### Step 4: Set up API Gateway or Function URL

**Option A: Lambda Function URL (Simplest)**
- Lambda → Configuration → Function URL
- Enable Function URL
- Set Auth type to NONE (or AWS_IAM if you want authentication)
- Copy the URL and use it as your API endpoint

**Option B: API Gateway**
- Create API Gateway REST API
- Connect it to your Lambda function
- Deploy the API

## Package Size Limits

- **Direct upload**: 50 MB (unzipped)
- **S3 upload**: 250 MB (unzipped)

If your package exceeds 50 MB, you can:
1. Upload to S3 first, then reference from Lambda
2. Use Lambda Layers for large dependencies

## What's Included in the Package

- ✅ All routes (`routes/`)
- ✅ Middleware (`middleware/`)
- ✅ Models (`models-dynamodb/`)
- ✅ Config files (`config/`)
- ✅ Public assets (`public/`)
- ✅ Production dependencies (`node_modules/`)
- ✅ Lambda handler (`lambda.js`)

## What's Excluded

- ❌ Test files
- ❌ Setup scripts
- ❌ Development dependencies
- ❌ Documentation files
- ❌ Amplify configuration
- ❌ `.env` files (configure via Lambda console)

## Troubleshooting

### Handler Error
- Make sure handler is set to: `lambda.handler`
- Verify `lambda.js` is in the root of the zip

### Module Not Found
- Check that all dependencies are in `package.json`
- Verify `node_modules` is included in the zip

### Timeout Errors
- Increase Lambda timeout in configuration
- Check database connection timeouts

### CORS Issues
- Verify CORS settings in `server.js`
- Add your frontend domain to allowed origins

