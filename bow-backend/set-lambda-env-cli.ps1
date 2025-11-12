# PowerShell script to set Lambda environment variables via AWS CLI
# Usage: .\set-lambda-env-cli.ps1

$functionName = "bow-backend-lambda"
$region = "us-west-2"

Write-Host "🔧 Setting Lambda Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Read from .env file
$envPath = Join-Path $PSScriptRoot ".env"
$envVars = @{}

if (Test-Path $envPath) {
    Write-Host "📄 Reading .env file..." -ForegroundColor Yellow
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^["'']|["'']$', ''
            $envVars[$key] = $value
        }
    }
} else {
    Write-Host "⚠️  .env file not found. Please enter values manually." -ForegroundColor Yellow
}

# Get required values
$awsRegion = if ($envVars.AWS_REGION) { $envVars.AWS_REGION } else { "us-west-2" }
$awsAccessKeyId = if ($envVars.AWS_ACCESS_KEY_ID) { $envVars.AWS_ACCESS_KEY_ID } else { Read-Host "AWS_ACCESS_KEY_ID" }
$awsSecretAccessKey = if ($envVars.AWS_SECRET_ACCESS_KEY) { $envVars.AWS_SECRET_ACCESS_KEY } else { Read-Host "AWS_SECRET_ACCESS_KEY" -AsSecureString | ConvertFrom-SecureString -AsPlainText }
$nodeEnv = if ($envVars.NODE_ENV) { $envVars.NODE_ENV } else { "production" }

if (-not $awsAccessKeyId -or -not $awsSecretAccessKey) {
    Write-Host "❌ Error: AWS credentials are required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Updating Lambda environment variables..." -ForegroundColor Yellow
Write-Host "   Function: $functionName"
Write-Host "   Region: $region"
Write-Host ""

# Build environment variables JSON
$envJson = @{
    Variables = @{
        AWS_REGION = $awsRegion
        AWS_ACCESS_KEY_ID = $awsAccessKeyId
        AWS_SECRET_ACCESS_KEY = $awsSecretAccessKey
        NODE_ENV = $nodeEnv
    }
}

# Add optional variables if they exist
if ($envVars.S3_BUCKET_NAME) {
    $envJson.Variables.S3_BUCKET_NAME = $envVars.S3_BUCKET_NAME
}
if ($envVars.SES_FROM_EMAIL) {
    $envJson.Variables.SES_FROM_EMAIL = $envVars.SES_FROM_EMAIL
}

# Convert to JSON and escape for AWS CLI
$envJsonString = $envJson | ConvertTo-Json -Compress
$envJsonEscaped = $envJsonString.Replace('"', '\"')

# Update Lambda function
try {
    Write-Host "1️⃣ Updating Lambda function configuration..." -ForegroundColor Yellow
    $updateCmd = "aws lambda update-function-configuration --function-name $functionName --region $region --environment `"Variables=$envJsonEscaped`" --output json"
    $result = Invoke-Expression $updateCmd | ConvertFrom-Json
    
    Write-Host "✅ Environment variables updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Set Variables:" -ForegroundColor Cyan
    Write-Host "   AWS_REGION: $($result.Environment.Variables.AWS_REGION)"
    Write-Host "   AWS_ACCESS_KEY_ID: $($result.Environment.Variables.AWS_ACCESS_KEY_ID.Substring(0, 8))..."
    Write-Host "   AWS_SECRET_ACCESS_KEY: ********"
    Write-Host "   NODE_ENV: $($result.Environment.Variables.NODE_ENV)"
    
    if ($result.Environment.Variables.S3_BUCKET_NAME) {
        Write-Host "   S3_BUCKET_NAME: $($result.Environment.Variables.S3_BUCKET_NAME)"
    }
    if ($result.Environment.Variables.SES_FROM_EMAIL) {
        Write-Host "   SES_FROM_EMAIL: $($result.Environment.Variables.SES_FROM_EMAIL)"
    }
    
    Write-Host ""
    Write-Host "⏳ Waiting for update to complete..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "✅ Lambda environment variables configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Test your API:" -ForegroundColor Cyan
    Write-Host "   https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/health"
    Write-Host ""
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception)" -ForegroundColor Red
    exit 1
}

