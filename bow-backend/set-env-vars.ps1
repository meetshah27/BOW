# Quick script to set Lambda environment variables
# Make sure you have AWS CLI configured

$functionName = "bow-backend-lambda"
$region = "us-west-2"

# Get credentials from user
Write-Host "🔧 Setting Lambda Environment Variables" -ForegroundColor Cyan
Write-Host ""

$awsRegion = Read-Host "AWS_REGION (default: us-west-2)"
if ([string]::IsNullOrWhiteSpace($awsRegion)) { $awsRegion = "us-west-2" }

$awsAccessKeyId = Read-Host "AWS_ACCESS_KEY_ID"
$awsSecretAccessKey = Read-Host "AWS_SECRET_ACCESS_KEY" -AsSecureString
$awsSecretAccessKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($awsSecretAccessKey))

Write-Host ""
Write-Host "📦 Updating Lambda environment variables..." -ForegroundColor Yellow

# Create environment variables JSON
$envVars = @{
    AWS_REGION = $awsRegion
    AWS_ACCESS_KEY_ID = $awsAccessKeyId
    AWS_SECRET_ACCESS_KEY = $awsSecretAccessKeyPlain
    NODE_ENV = "production"
}

$envJson = $envVars | ConvertTo-Json -Compress

# Update Lambda function
$cmd = "aws lambda update-function-configuration --function-name $functionName --region $region --environment `"Variables=$envJson`""
Invoke-Expression $cmd

Write-Host ""
Write-Host "✅ Environment variables updated!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Test: https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/health" -ForegroundColor Cyan

