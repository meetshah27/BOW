#!/bin/bash

# Simple API Gateway Setup Script
# Usage: ./setup-api-gateway-simple.sh <lambda-function-name> [api-name] [stage-name] [region]

LAMBDA_FUNCTION_NAME=$1
API_NAME=${2:-"bow-backend-api"}
STAGE_NAME=${3:-"prod"}
REGION=${4:-"us-west-2"}

if [ -z "$LAMBDA_FUNCTION_NAME" ]; then
    echo "❌ Error: Lambda Function Name is required!"
    echo "Usage: ./setup-api-gateway-simple.sh <lambda-function-name> [api-name] [stage-name] [region]"
    exit 1
fi

echo "🚀 Setting up API Gateway..."
echo "   Lambda Function: $LAMBDA_FUNCTION_NAME"
echo "   API Name: $API_NAME"
echo "   Stage: $STAGE_NAME"
echo "   Region: $REGION"
echo ""

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${LAMBDA_FUNCTION_NAME}"

# Step 1: Create REST API
echo "1️⃣ Creating REST API..."
API_ID=$(aws apigateway create-rest-api \
    --name "$API_NAME" \
    --endpoint-configuration types=REGIONAL \
    --region $REGION \
    --query 'id' \
    --output text)
echo "✅ API created: $API_ID"
echo ""

# Step 2: Get Root Resource ID
echo "2️⃣ Getting root resource ID..."
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id' \
    --output text)
echo "✅ Root resource ID: $ROOT_RESOURCE_ID"
echo ""

# Step 3: Create {proxy+} Resource
echo "3️⃣ Creating {proxy+} resource..."
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part "{proxy+}" \
    --region $REGION \
    --query 'id' \
    --output text)
echo "✅ Proxy resource created: $PROXY_RESOURCE_ID"
echo ""

# Step 4: Create ANY Method on Proxy Resource
echo "4️⃣ Creating ANY method on proxy resource..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --authorization-type NONE \
    --region $REGION > /dev/null
echo "✅ Proxy ANY method created"
echo ""

# Step 5: Set up Lambda Integration for Proxy
echo "5️⃣ Setting up Lambda integration for proxy..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
    --region $REGION > /dev/null
echo "✅ Proxy Lambda integration configured"
echo ""

# Step 6: Create ANY Method on Root Resource
echo "6️⃣ Creating ANY method on root resource..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_RESOURCE_ID \
    --http-method ANY \
    --authorization-type NONE \
    --region $REGION > /dev/null
echo "✅ Root ANY method created"
echo ""

# Step 7: Set up Lambda Integration for Root
echo "7️⃣ Setting up Lambda integration for root..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_RESOURCE_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
    --region $REGION > /dev/null
echo "✅ Root Lambda integration configured"
echo ""

# Step 8: Add Lambda Permission
echo "8️⃣ Adding Lambda permission..."
SOURCE_ARN="arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*"
aws lambda add-permission \
    --function-name $LAMBDA_FUNCTION_NAME \
    --statement-id apigateway-invoke-$(date +%s) \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "$SOURCE_ARN" \
    --region $REGION 2>/dev/null || echo "⚠️  Permission might already exist (this is OK)"
echo "✅ Lambda permission configured"
echo ""

# Step 9: Deploy API
echo "9️⃣ Deploying API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --region $REGION > /dev/null
echo "✅ API deployed to stage: $STAGE_NAME"
echo ""

# Get the endpoint URL
ENDPOINT_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE_NAME}"

echo "🎉 API Gateway setup complete!"
echo ""
echo "📋 Summary:"
echo "   API ID: $API_ID"
echo "   Stage: $STAGE_NAME"
echo "   Endpoint URL: $ENDPOINT_URL"
echo ""
echo "🧪 Test URLs:"
echo "   Root: $ENDPOINT_URL/"
echo "   Health: $ENDPOINT_URL/health"
echo "   API Events: $ENDPOINT_URL/api/events"
echo ""
echo "⚠️  Note: Enable CORS in the API Gateway console if needed"
echo "   Go to: Resources → {proxy+} → Actions → Enable CORS"

