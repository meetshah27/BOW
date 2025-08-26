# BOW Backend Connection Troubleshooting Guide

## 🚨 Automatic Disconnection Issues

If your backend is disconnecting automatically, this guide will help you identify and fix the problem.

## 🔍 Quick Diagnosis

### 1. Check Connection Status
```bash
# Test basic connection
npm run monitor

# Check health endpoint
curl http://localhost:3000/health
```

### 2. Common Error Messages
- `TimeoutError`: Connection timeout
- `NetworkError`: Network connectivity issues
- `NetworkingError`: AWS SDK connection problems
- `CredentialsError`: Invalid or expired AWS credentials

## 🛠️ Solutions

### Solution 1: Use Enhanced Startup Script
```bash
# Instead of npm start, use:
npm run start-stable
```

This script includes:
- Automatic .env file creation
- Environment variable validation
- Enhanced connection stability settings
- Better error handling

### Solution 2: Check Environment Variables
Ensure your `.env` file contains:
```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key

# Connection stability settings
AWS_HTTP_TIMEOUT=30000
AWS_MAX_RETRIES=3
AWS_CONNECTION_TIMEOUT=10000
AWS_REQUEST_TIMEOUT=30000
```

### Solution 3: Monitor Connections
```bash
# Run connection monitor in separate terminal
npm run monitor
```

This will show you:
- Connection health every 30 seconds
- Success/failure patterns
- Early warning of connection issues

## 🔧 Advanced Fixes

### Fix 1: Update AWS Configuration
The new `aws-config.js` includes:
- Connection pooling
- Automatic retries
- Keep-alive settings
- Health monitoring

### Fix 2: Use Connection Retry Middleware
The new middleware automatically:
- Detects connection failures
- Attempts to restore connections
- Retries failed operations
- Provides graceful error handling

### Fix 3: Enhanced Server Configuration
The updated `server.js` includes:
- Keep-alive timeout settings
- Socket timeout handling
- Better error logging
- Graceful shutdown

## 📊 Monitoring and Debugging

### Health Check Endpoint
```
GET /health
```
Returns detailed server status including:
- Database connection status
- Server uptime
- Memory usage
- Environment information

### Connection Monitor
```bash
npm run monitor
```
Continuous monitoring with:
- 30-second intervals
- Success rate tracking
- Failure pattern detection
- Real-time alerts

## 🚨 Emergency Procedures

### If Server Won't Start
1. Check port availability: `netstat -an | grep :3000`
2. Verify AWS credentials in `.env`
3. Check network connectivity
4. Review error logs

### If Connections Keep Dropping
1. Run connection monitor: `npm run monitor`
2. Check AWS service status
3. Verify IAM permissions
4. Review network configuration

### If Database Operations Fail
1. Test basic connection: `node test-connection.js`
2. Check DynamoDB table status
3. Verify AWS region settings
4. Review IAM policies

## 🔍 Diagnostic Commands

### Test AWS Connection
```bash
node test-aws-stability.js
```

### Test DynamoDB
```bash
node test-connection.js
```

### Test S3 Connection
```bash
node test-s3-connection.js
```

## 📝 Prevention Tips

1. **Use the stable startup script**: `npm run start-stable`
2. **Monitor connections regularly**: `npm run monitor`
3. **Keep AWS credentials updated**
4. **Use appropriate timeouts** (30+ seconds)
5. **Enable connection monitoring**
6. **Set up health checks**

## 🆘 Still Having Issues?

If problems persist:

1. Check the connection monitor output
2. Review server logs for error patterns
3. Verify AWS service status
4. Test with minimal configuration
5. Check network firewall settings
6. Verify IAM permissions

## 📞 Support

For additional help:
- Check server logs for specific error messages
- Run diagnostic scripts and share output
- Verify AWS account status and billing
- Check network connectivity to AWS services

---

**Remember**: The enhanced startup script (`npm run start-stable`) automatically creates the proper `.env` file and validates your configuration before starting the server.
