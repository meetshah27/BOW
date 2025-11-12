# Fix Lambda Handler Error

## Problem
Error: `Cannot find module 'index'` - Lambda is trying to load `index.handler` instead of `lambda.handler`

## Quick Fix

### Option 1: Use Script (Recommended)
```bash
cd bow-backend
npm run fix-lambda-handler
```

### Option 2: AWS Console
1. Go to AWS Lambda Console
2. Select your function: `bow-backend-lambda`
3. Go to **Configuration** tab
4. Click **Edit** on the **Runtime settings** section
5. Change **Handler** from `index.handler` to `lambda.handler`
6. Click **Save**

### Option 3: AWS CLI
```bash
aws lambda update-function-configuration \
  --function-name bow-backend-lambda \
  --handler lambda.handler \
  --region us-west-2
```

## Verify Handler is Correct

After fixing, check your Lambda function:
- Handler should be: `lambda.handler`
- Runtime should be: Node.js 18.x or 20.x

## Test Again

After updating, test your API:
```
https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/health
```

You should see a JSON response with status "OK" instead of an error.

