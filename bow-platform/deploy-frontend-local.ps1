# BOW Frontend deploy (run from bow-platform folder)
# One-time: set AWS credentials and Amplify app id. Option A: run in terminal before this script:
#   $env:AWS_ACCESS_KEY_ID="YOUR_KEY"
#   $env:AWS_SECRET_ACCESS_KEY="YOUR_SECRET"
#   $env:AWS_REGION="us-west-2"
#   $env:AWS_DEFAULT_REGION="us-west-2"
# Option B: set them below and run this script.

$ErrorActionPreference = "Stop"

# Optional: set here if you don't set in terminal (avoid committing real keys)
# $env:AWS_ACCESS_KEY_ID = "YOUR_ACCESS_KEY_ID"
# $env:AWS_SECRET_ACCESS_KEY = "YOUR_SECRET_ACCESS_KEY"
$env:AWS_REGION = "us-west-2"
$env:AWS_DEFAULT_REGION = "us-west-2"
$env:AWS_SDK_LOAD_CONFIG = "1"

# Your Amplify app id and environment (get from Amplify Console if unsure)
$appId = $env:AMPLIFY_APP_ID
$envName = $env:AMPLIFY_ENV
if (-not $envName) { $envName = "production" }

if (-not $env:AWS_ACCESS_KEY_ID -or -not $env:AWS_SECRET_ACCESS_KEY) {
    Write-Host "Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (in terminal or in this script) then re-run." -ForegroundColor Yellow
    exit 1
}

if (-not $appId) {
    Write-Host "First run: set AMPLIFY_APP_ID (e.g. set in terminal or edit this script). Get it from AWS Amplify Console -> your app -> App settings -> General." -ForegroundColor Yellow
    exit 1
}

Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Pulling Amplify (app: $appId env: $envName)..." -ForegroundColor Cyan
& amplify pull --appId $appId --envName $envName --yes
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Publishing to Amplify (invalidate CloudFront)..." -ForegroundColor Cyan
& amplify publish --invalidateCloudFront true --yes
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Frontend deploy done." -ForegroundColor Green
