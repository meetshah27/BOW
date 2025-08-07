@echo off
echo Fixing React build for AWS Amplify deployment...

REM Clean previous build
echo Cleaning previous build...
if exist "build" rmdir /s /q "build"

REM Install dependencies if needed
echo Installing dependencies...
npm install

REM Build production version
echo Building production version...
npm run build

REM Verify build output
if not exist "build\index.html" (
    echo ❌ Build failed! index.html not found.
    pause
    exit /b 1
)

REM Check if index.html is empty
for %%A in ("build\index.html") do set size=%%~zA
if %size% LSS 100 (
    echo ❌ Build failed! index.html is too small (%size% bytes).
    echo This usually means the build process failed.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Build directory: build\
echo 📄 index.html size: %size% bytes
echo.
echo Ready for Amplify deployment!
pause 