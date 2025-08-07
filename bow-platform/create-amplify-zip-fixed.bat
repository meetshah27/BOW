@echo off
echo Creating zip file for AWS Amplify deployment...

REM Check if build exists and is valid
if not exist "build\index.html" (
    echo ❌ Build not found! Please run npm run build first.
    pause
    exit /b 1
)

REM Check build file size
for %%A in ("build\index.html") do set size=%%~zA
if %size% LSS 100 (
    echo ❌ Build appears to be invalid! index.html is too small (%size% bytes).
    pause
    exit /b 1
)

REM Remove old zip if exists
if exist "bow-frontend-amplify-fixed.zip" del "bow-frontend-amplify-fixed.zip"

REM Create zip file for Amplify
echo Creating zip file...
powershell Compress-Archive -Path "build\*" -DestinationPath "bow-frontend-amplify-fixed.zip" -Force

echo.
echo ✅ Zip file created: bow-frontend-amplify-fixed.zip
echo 📁 Contains: build\* (all build files)
echo 📄 index.html size: %size% bytes
echo.
echo 🚀 Ready for Amplify deployment!
echo.
echo Next steps:
echo 1. Go to AWS Amplify Console
echo 2. Upload bow-frontend-amplify-fixed.zip
echo 3. Deploy!
echo.
pause 