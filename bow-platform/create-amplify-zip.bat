@echo off
echo Creating zip file for AWS Amplify deployment...

REM Clean previous build
echo Cleaning previous build...
if exist "build" rmdir /s /q "build"
if exist "bow-frontend-amplify.zip" del "bow-frontend-amplify.zip"

REM Install dependencies if needed
echo Installing dependencies...
npm install

REM Build production version
echo Building production version...
npm run build

REM Verify build was successful
if not exist "build\index.html" (
    echo ❌ Build failed! index.html not found.
    pause
    exit /b 1
)

REM Check if index.html has content
for %%A in ("build\index.html") do set size=%%~zA
if %size%==0 (
    echo ❌ Build failed! index.html is empty.
    pause
    exit /b 1
)

REM Create zip file for Amplify
echo Creating zip file...
powershell Compress-Archive -Path "build\*" -DestinationPath "bow-frontend-amplify.zip" -Force

echo.
echo ✅ Zip file created: bow-frontend-amplify.zip
echo ✅ Build size: %size% bytes
echo.
echo 📦 Ready for Amplify deployment!
echo.
echo Next steps:
echo 1. Go to AWS Amplify Console
echo 2. Create a new app or use existing app
echo 3. Choose "Deploy without Git provider"
echo 4. Upload bow-frontend-amplify.zip
echo 5. Deploy!
echo.
pause 