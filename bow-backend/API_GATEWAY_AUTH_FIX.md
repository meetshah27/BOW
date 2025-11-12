# API Gateway "Unauthorized" Error Fix

## Problem

Getting `{"error": "Unauthorized"}` when accessing:
- `POST /users/login`
- `POST /users/register`

## Root Cause

This error is coming from **API Gateway**, not from your Express backend. API Gateway might have an **authorizer** configured that's blocking these routes.

## Solution: Check API Gateway Configuration

### Step 1: Check for API Gateway Authorizers

1. Go to **API Gateway Console** → Your API → **Authorizers**
2. Check if there are any authorizers configured
3. If authorizers exist, they might be blocking public routes

### Step 2: Check Method Authorization

1. Go to **API Gateway Console** → Your API → **Resources**
2. Navigate to the `{proxy+}` resource
3. Click on the **ANY** method
4. Check the **Authorization** setting:
   - It should be **NONE** (no authorization required)
   - If it's set to **AWS_IAM** or a **Cognito Authorizer**, that's the problem!

### Step 3: Fix Authorization Settings

**Option A: Remove Authorization (Recommended for public routes)**

1. Select the `{proxy+}` resource
2. Click on the **ANY** method
3. Click **Method Request**
4. Set **Authorization** to **NONE**
5. Click the checkmark ✓
6. **Deploy** the API again

**Option B: Create Separate Public Routes**

If you need some routes to be public and others protected:

1. Create a new resource: `/users` (without proxy)
2. Create methods: `POST /users/login` and `POST /users/register`
3. Set authorization to **NONE** for these methods
4. Keep `{proxy+}` with authorization for other routes

### Step 4: Check OPTIONS Method (CORS Preflight)

1. Make sure you have an **OPTIONS** method on `{proxy+}`
2. Set authorization to **NONE** for OPTIONS
3. This is required for CORS preflight requests

### Step 5: Verify Route Registration

Check that your routes are registered correctly in `server.js`:

```javascript
app.use('/users', usersRouter);  // ✅ This is correct
```

This means:
- `POST /users/login` → routes to `router.post('/login', ...)`
- `POST /users/register` → routes to `router.post('/register', ...)`

### Step 6: Deploy API Gateway

After making changes:
1. Click **Actions** → **Deploy API**
2. Select your stage (e.g., `prod`)
3. Click **Deploy**

## Test Endpoints

After fixing, test these:

### 1. Test Users API (Public)
```
GET https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/users/test
```

Should return:
```json
{
  "message": "Users API is working!",
  "timestamp": "...",
  "endpoints": {
    "login": "POST /users/login",
    "register": "POST /users/register"
  }
}
```

### 2. Test Login
```
POST https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/users/login
Content-Type: application/json

{
  "email": "ganesh123@gmail.com",
  "password": "ganeshkhandekar7"
}
```

### 3. Test Register
```
POST https://b312t31med.execute-api.us-west-2.amazonaws.com/prod/users/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

## Common Issues

### Issue 1: API Gateway Authorizer Blocking Routes

**Symptom:** `{"error": "Unauthorized"}`

**Fix:** Set authorization to **NONE** for public routes

### Issue 2: CORS Preflight Failing

**Symptom:** Browser shows CORS error in console

**Fix:** 
- Enable CORS on `{proxy+}` resource
- Make sure OPTIONS method has authorization **NONE**

### Issue 3: Route Not Found

**Symptom:** `{"error": "Not Found"}`

**Fix:**
- Check that `{proxy+}` resource exists
- Verify Lambda proxy integration is enabled
- Make sure API is deployed

## Quick Fix Checklist

- [ ] Check API Gateway → Resources → `{proxy+}` → ANY method
- [ ] Set Authorization to **NONE**
- [ ] Check OPTIONS method has Authorization **NONE**
- [ ] Enable CORS on `{proxy+}` resource
- [ ] Deploy API Gateway
- [ ] Test with `/users/test` endpoint
- [ ] Test login/register endpoints

## Verification

After fixing, you should see in CloudWatch logs:
```
[POST /users/login] Login request received
[POST /users/login] Request body: { email: '...', password: '...' }
```

If you don't see these logs, the request isn't reaching Lambda (API Gateway is blocking it).

---

**Note:** The Express routes don't require authentication (no `verifyCognito` middleware), so if you're getting "Unauthorized", it's definitely API Gateway blocking the request before it reaches Lambda.

