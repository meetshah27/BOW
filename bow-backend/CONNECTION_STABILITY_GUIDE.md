# Connection Stability Guide

## 🚨 **Why Your Backend Disconnects Every 3-4 Minutes**

Your backend is experiencing frequent disconnections due to several timeout and connection management issues:

### **Root Causes:**
1. **Aggressive AWS SDK timeouts** (30 seconds)
2. **Short socket timeouts** (30 seconds) 
3. **Insufficient keep-alive settings**
4. **Limited connection pooling**

## 🛠️ **Solutions Implemented**

### **1. Updated AWS Configuration (`config/aws-config.js`)**
- **Request timeout**: 30s → 120s (2 minutes)
- **Connection timeout**: 10s → 30s
- **Keep-alive interval**: 30s → 60s
- **Max sockets**: 50 → 100
- **Free socket timeout**: 30s → 60s

### **2. Enhanced Server Settings (`server.js`)**
- **Keep-alive timeout**: 65s → 120s
- **Headers timeout**: 65s → 125s
- **Socket timeout**: 30s → 120s
- **TCP keep-alive**: Enabled with 60s interval

### **3. Improved Connection Monitoring**
- **Health check frequency**: 60s → 30s
- **Client recreation**: After 3 consecutive failures
- **Better error handling and logging**

## 🔧 **Environment Variables to Set**

Add these to your `.env` file for optimal stability:

```bash
# AWS SDK Timeouts (in milliseconds)
AWS_MAX_RETRIES=5
AWS_REQUEST_TIMEOUT=120000
AWS_CONNECTION_TIMEOUT=30000
AWS_HTTP_TIMEOUT=120000

# Server Connection Settings (in milliseconds)
KEEP_ALIVE_TIMEOUT=120000
HEADERS_TIMEOUT=125000
SOCKET_TIMEOUT=120000

# Connection Monitoring
CONNECTION_MONITOR_INTERVAL=30000
```

## 📊 **Timeout Comparison**

| Setting | Before | After | Improvement |
|---------|--------|-------|-------------|
| AWS Request Timeout | 30s | 120s | 4x longer |
| Socket Timeout | 30s | 120s | 4x longer |
| Keep-alive | 65s | 120s | 2x longer |
| Health Check | 60s | 30s | 2x more frequent |

## 🚀 **Expected Results**

After implementing these changes:
- ✅ **No more 3-4 minute disconnections**
- ✅ **Stable long-running connections**
- ✅ **Automatic connection recovery**
- ✅ **Better error handling and logging**
- ✅ **Improved performance under load**

## 🔍 **Monitoring Your Connections**

### **Health Check Endpoint**
```
GET /health
```

### **Console Logs to Watch For**
```
✅ Connection restored at: [timestamp]
🔄 Too many consecutive failures, attempting to recreate DynamoDB client...
✅ DynamoDB client recreated successfully
🔌 New connection established
🔌 Connection closed normally
```

### **Troubleshooting Commands**
```bash
# Check connection health
curl http://localhost:3000/health

# Monitor server logs
tail -f logs/server.log

# Test AWS connectivity
node test-aws-credentials.js
```

## ⚠️ **Important Notes**

1. **These timeouts are safe** - AWS services support much longer timeouts
2. **Memory usage** - Slightly higher due to connection pooling
3. **Network stability** - Better handling of network interruptions
4. **Production ready** - These settings are optimized for production use

## 🔄 **If Issues Persist**

1. **Check AWS service limits** in your region
2. **Verify network stability** between your server and AWS
3. **Monitor AWS CloudWatch** for service issues
4. **Review security group** and VPC settings
5. **Check for rate limiting** on your AWS account

## 📞 **Support**

If you continue experiencing issues after implementing these changes:
1. Check the server logs for specific error messages
2. Monitor the `/health` endpoint for connection status
3. Verify your AWS credentials and permissions
4. Test with a simple AWS SDK operation

---

**Last Updated**: $(date)
**Version**: 1.0
**Status**: ✅ Implemented
