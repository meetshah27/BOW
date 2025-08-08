# 🔒 BOW Security Checklist

## Quick Security Verification

### ✅ **Step 1: Check Dependencies**
```bash
cd bow-backend
npm audit
```
**Expected Result**: "found 0 vulnerabilities"

### ✅ **Step 2: Verify Security Packages**
```bash
cd bow-backend
npm list helmet express-rate-limit aws-jwt-verify bcryptjs cors
```
**Expected Result**: All packages should be listed as installed

### ✅ **Step 3: Check Environment Variables**
```bash
cd bow-backend
# Check if .env file exists
ls -la .env
```
**Expected Result**: `.env` file should exist (or use `env.example` as template)

### ✅ **Step 4: Verify Security Files**
Check these files exist and are properly configured:
- ✅ `bow-backend/middleware/security.js` - Security middleware
- ✅ `bow-backend/middleware/verifyCognito.js` - Cognito verification
- ✅ `bow-backend/config/environment.js` - Environment configuration
- ✅ `bow-platform/src/config/api.js` - API configuration

### ✅ **Step 5: Test Security Headers**
Start your server and check headers:
```bash
cd bow-backend
npm start
# In another terminal:
curl -I http://localhost:3000/health
```
**Expected Headers**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### ✅ **Step 6: Test Rate Limiting**
```bash
# Make multiple rapid requests
for i in {1..110}; do curl http://localhost:3000/health; done
```
**Expected Result**: After 100 requests, you should get rate limit error

### ✅ **Step 7: Check Authentication**
```bash
# Test protected endpoint without token
curl http://localhost:3000/api/events
```
**Expected Result**: 401 Unauthorized response

## 🔍 **Manual Security Checks**

### **Frontend Security**:
- [ ] API URLs use environment variables (`REACT_APP_API_URL`)
- [ ] Authentication tokens are properly managed
- [ ] Protected routes check user authentication
- [ ] No hardcoded secrets in code

### **Backend Security**:
- [ ] Security middleware is applied (`helmet`, `rate-limit`)
- [ ] CORS is properly configured
- [ ] JWT verification is working
- [ ] Request size limits are set (10MB)
- [ ] Error handling doesn't expose sensitive info

### **Environment Security**:
- [ ] `.env` file exists with proper values
- [ ] No secrets committed to git
- [ ] AWS credentials are properly configured
- [ ] Cognito settings are correct

## 🚨 **Security Alerts**

### **If you see these, fix immediately**:
- ❌ `npm audit` shows vulnerabilities
- ❌ Hardcoded API keys or secrets
- ❌ Missing security headers
- ❌ Rate limiting not working
- ❌ Authentication bypass possible

### **If you see these, investigate**:
- ⚠️ Missing environment variables
- ⚠️ Security middleware not loaded
- ⚠️ CORS errors in browser console
- ⚠️ Authentication errors

## 🛠️ **Quick Fixes**

### **Fix Dependencies**:
```bash
cd bow-backend
npm audit fix
```

### **Create Environment File**:
```bash
cd bow-backend
cp env.example .env
# Edit .env with your actual values
```

### **Test Security Script**:
```bash
cd bow-backend
node test-security.js
```

## 📊 **Security Score**

Count your ✅ marks:
- **7-8 ✅**: Excellent security
- **5-6 ✅**: Good security (fix missing items)
- **3-4 ✅**: Fair security (needs improvement)
- **0-2 ✅**: Poor security (major fixes needed)

## 🔗 **Resources**

- **Full Security Guide**: `SECURITY_GUIDE.md`
- **Environment Template**: `bow-backend/env.example`
- **Security Testing**: `bow-backend/test-security.js`

---

**Last Updated**: December 2024
**Next Review**: Monthly

