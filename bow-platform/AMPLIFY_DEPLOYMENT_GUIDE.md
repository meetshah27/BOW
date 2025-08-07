# AWS Amplify Deployment Guide

## 🚀 Deploy Frontend to AWS Amplify

### Step 1: Create Deployment Zip

Run the batch script to create the zip file:
```bash
cd bow-platform
create-amplify-zip.bat
```

Or manually:
```bash
cd bow-platform
npm run build
powershell Compress-Archive -Path "build\*" -DestinationPath "bow-frontend-amplify.zip"
```

### Step 2: Deploy to AWS Amplify

1. **Go to AWS Amplify Console**
   - Open AWS Console
   - Navigate to AWS Amplify
   - Click "New app" → "Host web app"

2. **Choose Deployment Method**
   - Select "Deploy without Git provider"
   - Click "Continue"

3. **Upload Your Zip File**
   - Click "Choose file"
   - Select `bow-frontend-amplify.zip`
   - Click "Save and deploy"

4. **Wait for Deployment**
   - Amplify will automatically deploy your app
   - You'll get a URL like: `https://main.d1234567890.amplifyapp.com`

### Step 3: Configure Build Settings (Optional)

If you need custom build settings, add this to your app:

**Build settings** (in Amplify Console → App settings → Build settings):
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - echo "Using pre-built files"
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Environment Variables (If Needed)

In Amplify Console → App settings → Environment variables:
```
NODE_ENV=production
```

## 🔧 Configuration Verification

### ✅ Your Frontend is Already Configured

Your API configuration in `src/config/api.js` automatically:
- Uses Lambda endpoint in production: `https://z1rt2gxnei.execute-api.us-west-2.amazonaws.com/default/bow-backend-clean`
- Uses localhost in development: `http://localhost:3000/api/*`

### ✅ Environment Detection Works

The app automatically detects:
- **Amplify domain** → Production mode → Lambda API
- **Localhost** → Development mode → Local server

## 🚨 Important Notes

1. **CORS**: Your Lambda backend already has CORS configured for Amplify domains
2. **Routing**: Amplify automatically handles React Router (SPA routing)
3. **HTTPS**: Amplify provides SSL certificates automatically
4. **CDN**: Amplify uses CloudFront for global distribution

## 🔍 Testing After Deployment

1. **Check the App**: Visit your Amplify URL
2. **Test API Calls**: Open browser console, make any API call
3. **Verify Features**: Test events, stories, volunteer opportunities
4. **Check Network Tab**: Confirm API calls go to Lambda endpoint

## 📊 Monitoring

- **Amplify Console**: View deployment status, logs, and performance
- **CloudWatch**: Monitor Lambda function performance
- **Browser Console**: Check for any frontend errors

## 🔄 Updating Your App

To update your deployed app:
1. Make changes to your code
2. Run `npm run build`
3. Create new zip file
4. Upload to Amplify Console
5. Deploy

## 🆘 Troubleshooting

### Common Issues:

1. **API Calls Failing**
   - Check CORS configuration in Lambda
   - Verify API Gateway endpoint is accessible
   - Check browser console for errors

2. **Routing Issues**
   - Amplify should handle SPA routing automatically
   - If not, add redirect rules in Amplify Console

3. **Build Errors**
   - Check Amplify build logs
   - Verify all dependencies are in package.json

## 📞 Support

If you encounter issues:
1. Check Amplify Console logs
2. Verify Lambda backend is working
3. Test API endpoint directly
4. Check browser console for errors

## 🎉 Success!

Once deployed, your frontend will:
- ✅ Automatically connect to your Lambda backend
- ✅ Use production API endpoints
- ✅ Handle all routing correctly
- ✅ Work with all your features (events, stories, etc.) 