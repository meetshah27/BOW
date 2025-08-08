# 🔒 BOW Security Guide

## Overview
This document outlines the security measures implemented in the Beats of Washington (BOW) application and provides guidelines for maintaining security best practices.

## 🛡️ Security Measures Implemented

### 1. **API Security**
- **Environment Variables**: All sensitive configuration moved to environment variables
- **Authentication Headers**: Automatic Bearer token inclusion in all API requests
- **Token Management**: Automatic cleanup of invalid tokens on 401 responses
- **Rate Limiting**: Implemented rate limiting to prevent abuse (100 requests per 15 minutes per IP)

### 2. **Backend Security**
- **Helmet.js**: Comprehensive security headers including:
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - Referrer Policy
- **CORS Configuration**: Strict origin validation
- **Input Validation**: Request body size limits (10MB)
- **Error Handling**: Secure error responses without sensitive information

### 3. **Authentication & Authorization**
- **AWS Cognito Integration**: JWT token verification
- **Role-Based Access Control**: Admin and member role system
- **Session Management**: Secure token storage and cleanup
- **Protected Routes**: Frontend route protection with role validation

### 4. **Data Security**
- **DynamoDB**: Secure AWS DynamoDB integration
- **S3 Security**: Secure file uploads with proper CORS
- **Password Hashing**: bcryptjs for password security
- **Input Sanitization**: Request validation and sanitization

## 🔧 Environment Configuration

### Required Environment Variables

#### Backend (.env)
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Cognito Configuration
COGNITO_USER_POOL_ID=us-east-1_Zk7dtdrv3
COGNITO_CLIENT_ID=1p577744bm0bko388dq4g5it16
COGNITO_REGION=us-east-1

# Security
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com

# AWS Amplify Configuration
REACT_APP_AWS_REGION=us-west-2
REACT_APP_USER_POOL_ID=us-west-2_Imazy2DXa
REACT_APP_USER_POOL_WEB_CLIENT_ID=7qiar42f9ujh3p8atoel4dp055
REACT_APP_OAUTH_DOMAIN=bow-users.auth.us-west-2.amazoncognito.com
```

## 🚨 Security Checklist

### Before Deployment
- [ ] All environment variables are set
- [ ] JWT_SECRET is a strong, random string
- [ ] SESSION_SECRET is unique and secure
- [ ] AWS credentials have minimal required permissions
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced in production
- [ ] Security headers are properly configured

### Regular Security Audits
- [ ] Review and rotate AWS access keys quarterly
- [ ] Update dependencies for security patches
- [ ] Monitor application logs for suspicious activity
- [ ] Review user permissions and roles
- [ ] Test authentication flows
- [ ] Verify CORS configuration

### Production Security
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable AWS CloudTrail for API logging
- [ ] Set up AWS WAF for additional protection
- [ ] Configure AWS CloudWatch alarms
- [ ] Use AWS Certificate Manager for SSL/TLS
- [ ] Enable AWS Config for compliance monitoring

## 🔍 Security Monitoring

### Log Monitoring
Monitor these logs for security events:
- Authentication failures
- Rate limit violations
- Unauthorized access attempts
- File upload anomalies
- Payment processing errors

### AWS CloudWatch Alarms
Set up alarms for:
- High error rates
- Unusual traffic patterns
- Failed authentication attempts
- API Gateway throttling

## 🛠️ Security Tools

### Dependencies
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **aws-jwt-verify**: JWT verification
- **bcryptjs**: Password hashing
- **cors**: CORS protection

### AWS Services
- **AWS Cognito**: User authentication
- **AWS DynamoDB**: Secure data storage
- **AWS S3**: Secure file storage
- **AWS IAM**: Access control
- **AWS CloudTrail**: API logging

## 🚫 Security Anti-Patterns to Avoid

1. **Never commit sensitive data** to version control
2. **Don't use hardcoded credentials** in code
3. **Avoid storing tokens** in localStorage for sensitive applications
4. **Don't expose internal APIs** without proper authentication
5. **Never log sensitive information** like passwords or tokens
6. **Avoid using HTTP** in production environments

## 🔐 Authentication Flow

### Frontend Authentication
1. User logs in via Cognito or email/password
2. Token is stored securely in localStorage
3. All API requests include Bearer token
4. Invalid tokens are automatically cleared
5. Protected routes check authentication status

### Backend Authentication
1. JWT token is extracted from Authorization header
2. Token is verified using AWS Cognito
3. User information is synced with DynamoDB
4. Request proceeds with user context
5. Unauthorized requests return 401 status

## 📞 Security Incident Response

### Immediate Actions
1. **Isolate the issue**: Identify affected systems
2. **Preserve evidence**: Log all relevant information
3. **Assess impact**: Determine scope of compromise
4. **Implement fixes**: Apply security patches
5. **Monitor**: Watch for additional attacks

### Contact Information
- **Security Team**: security@bow.org
- **AWS Support**: For AWS-related security issues
- **Emergency**: For critical security incidents

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-learning/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

## 🔄 Security Updates

This security guide should be reviewed and updated:
- Monthly for security best practices
- Quarterly for dependency updates
- Annually for comprehensive security audit
- After any security incidents

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintained By**: BOW Development Team
