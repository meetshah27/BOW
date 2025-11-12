# PowerShell Script for API Gateway Setup
# Usage: .\setup-api-gateway-simple.ps1 -LambdaFunctionName <name> [-ApiName <name>] [-StageName <name>] [-Region <region>]

param(
    [Parameter(Mandatory=$true)]
    [string]$LambdaFunctionName,
    
    [string]$ApiName = "bow-backend-api",
    [string]$StageName = "prod",
    [string]$Region = "us-west-2"
)

Write-Host "🚀 Setting up API Gateway..." -ForegroundColor Cyan
Write-Host "   Lambda Function: $LambdaFunctionName"
Write-Host "   API Name: $ApiName"
Write-Host "   Stage: $StageName"
Write-Host "   Region: $Region"
Write-Host ""

# Get AWS Account ID
$AccountId = aws sts get-caller-identity --query Account --output text
$LambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:${LambdaFunctionName}"

# Step 1: Create REST API
Write-Host "1️⃣ Creating REST API..." -ForegroundColor Yellow
$ApiResponse = aws apigateway create-rest-api --name $ApiName --endpoint-configuration types=REGIONAL --region $Region --output json | ConvertFrom-Json
$ApiId = $ApiResponse.id
Write-Host "✅ API created: $ApiId" -ForegroundColor Green
Write-Host ""

# Step 2: Get Root Resource ID
Write-Host "2️⃣ Getting root resource ID..." -ForegroundColor Yellow
$ResourcesResponse = aws apigateway get-resources --rest-api-id $ApiId --region $Region --output json | ConvertFrom-Json
$RootResourceId = ($ResourcesResponse.items | Where-Object { $_.path -eq "/" }).id
Write-Host "✅ Root resource ID: $RootResourceId" -ForegroundColor Green
Write-Host ""

# Step 3: Create {proxy+} Resource
Write-Host "3️⃣ Creating {proxy+} resource..." -ForegroundColor Yellow
$ProxyResponse = aws apigateway create-resource --rest-api-id $ApiId --parent-id $RootResourceId --path-part "{proxy+}" --region $Region --output json | ConvertFrom-Json
$ProxyResourceId = $ProxyResponse.id
Write-Host "✅ Proxy resource created: $ProxyResourceId" -ForegroundColor Green
Write-Host ""

# Step 4: Create ANY Method on Proxy Resource
Write-Host "4️⃣ Creating ANY method on proxy resource..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $ApiId --resource-id $ProxyResourceId --http-method ANY --authorization-type NONE --region $Region | Out-Null
Write-Host "✅ Proxy ANY method created" -ForegroundColor Green
Write-Host ""

# Step 5: Set up Lambda Integration for Proxy
Write-Host "5️⃣ Setting up Lambda integration for proxy..." -ForegroundColor Yellow
$IntegrationUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${LambdaArn}/invocations"
aws apigateway put-integration --rest-api-id $ApiId --resource-id $ProxyResourceId --http-method ANY --type AWS_PROXY --integration-http-method POST --uri $IntegrationUri --region $Region | Out-Null
Write-Host "✅ Proxy Lambda integration configured" -ForegroundColor Green
Write-Host ""

# Step 6: Create ANY Method on Root Resource
Write-Host "6️⃣ Creating ANY method on root resource..." -ForegroundColor Yellow
aws apigateway put-method --rest-api-id $ApiId --resource-id $RootResourceId --http-method ANY --authorization-type NONE --region $Region | Out-Null
Write-Host "✅ Root ANY method created" -ForegroundColor Green
Write-Host ""

# Step 7: Set up Lambda Integration for Root
Write-Host "7️⃣ Setting up Lambda integration for root..." -ForegroundColor Yellow
aws apigateway put-integration --rest-api-id $ApiId --resource-id $RootResourceId --http-method ANY --type AWS_PROXY --integration-http-method POST --uri $IntegrationUri --region $Region | Out-Null
Write-Host "✅ Root Lambda integration configured" -ForegroundColor Green
Write-Host ""

# Step 8: Add Lambda Permission
Write-Host "8️⃣ Adding Lambda permission..." -ForegroundColor Yellow
$SourceArn = "arn:aws:execute-api:${Region}:${AccountId}:${ApiId}/*/*"
$Timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
aws lambda add-permission --function-name $LambdaFunctionName --statement-id "apigateway-invoke-$Timestamp" --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn $SourceArn --region $Region 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Permission might already exist (this is OK)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Lambda permission configured" -ForegroundColor Green
}
Write-Host ""

# Step 9: Deploy API
Write-Host "9️⃣ Deploying API..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $ApiId --stage-name $StageName --region $Region | Out-Null
Write-Host "✅ API deployed to stage: $StageName" -ForegroundColor Green
Write-Host ""

# Get the endpoint URL
$EndpointUrl = "https://${ApiId}.execute-api.${Region}.amazonaws.com/${StageName}"

Write-Host "🎉 API Gateway setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:"
Write-Host "   API ID: $ApiId"
Write-Host "   Stage: $StageName"
Write-Host "   Endpoint URL: $EndpointUrl"
Write-Host ""
Write-Host "🧪 Test URLs:"
Write-Host "   Root: $EndpointUrl/"
Write-Host "   Health: $EndpointUrl/health"
Write-Host "   API Events: $EndpointUrl/api/events"
Write-Host ""
Write-Host "⚠️  Note: Enable CORS in the API Gateway console if needed"
Write-Host "   Go to: Resources → {proxy+} → Actions → Enable CORS"

