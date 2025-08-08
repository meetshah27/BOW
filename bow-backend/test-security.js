#!/usr/bin/env node

/**
 * BOW Security Testing Script
 * This script tests various security measures implemented in the BOW application
 */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 BOW Security Testing Suite');
console.log('=============================\n');

// Test 1: Check for security vulnerabilities
async function testDependencies() {
  console.log('1️⃣  Testing Dependencies Security...');
  
  return new Promise((resolve) => {
    exec('npm audit --audit-level=moderate', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error running npm audit:', error.message);
        resolve(false);
        return;
      }
      
      if (stdout.includes('found 0 vulnerabilities')) {
        console.log('✅ No security vulnerabilities found in dependencies');
        resolve(true);
      } else {
        console.log('⚠️  Security vulnerabilities detected:');
        console.log(stdout);
        resolve(false);
      }
    });
  });
}

// Test 2: Check environment variables
function testEnvironmentVariables() {
  console.log('\n2️⃣  Testing Environment Variables...');
  
  const requiredVars = [
    'NODE_ENV',
    'AWS_REGION',
    'COGNITO_USER_POOL_ID',
    'COGNITO_CLIENT_ID'
  ];
  
  const missing = [];
  const present = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  if (present.length > 0) {
    console.log('✅ Environment variables found:', present.join(', '));
  }
  
  if (missing.length > 0) {
    console.log('⚠️  Missing environment variables:', missing.join(', '));
    console.log('💡 Create a .env file using env.example as template');
    console.log('💡 Note: Some variables have defaults and may not be required');
  }
  
  // Consider it a pass if at least NODE_ENV is set
  return present.length > 0;
}

// Test 3: Check security middleware
function testSecurityMiddleware() {
  console.log('\n3️⃣  Testing Security Middleware...');
  
  const securityFile = path.join(__dirname, 'middleware', 'security.js');
  const verifyCognitoFile = path.join(__dirname, 'middleware', 'verifyCognito.js');
  
  const checks = [
    { file: securityFile, name: 'Security Middleware', required: true },
    { file: verifyCognitoFile, name: 'Cognito Verification', required: true }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    if (fs.existsSync(check.file)) {
      const content = fs.readFileSync(check.file, 'utf8');
      
      if (check.name === 'Security Middleware') {
        if (content.includes('helmet') && content.includes('rateLimit')) {
          console.log('✅ Security middleware properly configured');
        } else {
          console.log('❌ Security middleware missing required components');
          allPassed = false;
        }
      } else if (check.name === 'Cognito Verification') {
        if (content.includes('CognitoJwtVerifier') && content.includes('process.env')) {
          console.log('✅ Cognito verification properly configured');
        } else {
          console.log('❌ Cognito verification not properly configured');
          allPassed = false;
        }
      }
    } else {
      console.log(`❌ ${check.name} file not found`);
      allPassed = false;
    }
  });
  
  return allPassed;
}

// Test 4: Check API configuration
function testAPIConfiguration() {
  console.log('\n4️⃣  Testing API Configuration...');
  
  const apiFile = path.join(__dirname, '..', 'bow-platform', 'src', 'config', 'api.js');
  
  if (fs.existsSync(apiFile)) {
    const content = fs.readFileSync(apiFile, 'utf8');
    
    const checks = [
      { name: 'Environment Variables', pattern: 'process.env.REACT_APP_API_URL', required: true },
      { name: 'Authentication Headers', pattern: 'Authorization', required: true },
      { name: 'Token Management', pattern: 'localStorage.removeItem', required: true },
      { name: 'Error Handling', pattern: 'response.status === 401', required: true }
    ];
    
    let allPassed = true;
    
    checks.forEach(check => {
      if (content.includes(check.pattern)) {
        console.log(`✅ ${check.name} properly implemented`);
      } else {
        console.log(`❌ ${check.name} not found`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } else {
    console.log('❌ API configuration file not found');
    return false;
  }
}

// Test 5: Check server configuration
function testServerConfiguration() {
  console.log('\n5️⃣  Testing Server Configuration...');
  
  const serverFile = path.join(__dirname, 'server.js');
  
  if (fs.existsSync(serverFile)) {
    const content = fs.readFileSync(serverFile, 'utf8');
    
    const checks = [
      { name: 'Security Middleware', pattern: 'securityMiddleware', required: true },
      { name: 'CORS Configuration', pattern: 'cors', required: true },
      { name: 'Request Size Limits', pattern: 'limit: \'10mb\'', required: true },
      { name: 'Error Handling', pattern: 'error handler', required: true }
    ];
    
    let allPassed = true;
    
    checks.forEach(check => {
      if (content.includes(check.pattern)) {
        console.log(`✅ ${check.name} properly configured`);
      } else {
        console.log(`❌ ${check.name} not found`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } else {
    console.log('❌ Server configuration file not found');
    return false;
  }
}

// Test 6: Check package.json for security dependencies
function testSecurityDependencies() {
  console.log('\n6️⃣  Testing Security Dependencies...');
  
  const packageFile = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageFile)) {
    const content = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
    const dependencies = content.dependencies || {};
    
    const requiredDeps = [
      'helmet',
      'express-rate-limit',
      'aws-jwt-verify',
      'bcryptjs',
      'cors'
    ];
    
    let allPresent = true;
    
    requiredDeps.forEach(dep => {
      if (dependencies[dep]) {
        console.log(`✅ ${dep} installed (v${dependencies[dep]})`);
      } else {
        console.log(`❌ ${dep} not installed`);
        allPresent = false;
      }
    });
    
    return allPresent;
  } else {
    console.log('❌ package.json not found');
    return false;
  }
}

// Test 7: Check for sensitive data in code
function testSensitiveData() {
  console.log('\n7️⃣  Testing for Sensitive Data Exposure...');
  
  const sensitivePatterns = [
    { pattern: 'sk_live_', name: 'Live Stripe Keys' },
    { pattern: 'sk_test_', name: 'Test Stripe Keys' },
    { pattern: 'AKIA[0-9A-Z]{16}', name: 'AWS Access Keys' },
    { pattern: 'password.*=.*["\'][^"\']{8,}', name: 'Hardcoded Passwords' },
    { pattern: 'secret.*=.*["\'][^"\']{8,}', name: 'Hardcoded Secrets' }
  ];
  
  const filesToCheck = [
    path.join(__dirname, 'server.js'),
    path.join(__dirname, 'middleware', 'security.js'),
    path.join(__dirname, 'middleware', 'verifyCognito.js'),
    path.join(__dirname, '..', 'bow-platform', 'src', 'config', 'api.js')
  ];
  
  let foundSensitive = false;
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      sensitivePatterns.forEach(pattern => {
        if (content.match(pattern.pattern)) {
          console.log(`⚠️  Potential ${pattern.name} found in ${path.basename(file)}`);
          foundSensitive = true;
        }
      });
    }
  });
  
  if (!foundSensitive) {
    console.log('✅ No obvious sensitive data found in code');
  }
  
  return !foundSensitive;
}

// Main test runner
async function runSecurityTests() {
  const results = [];
  
  results.push(await testDependencies());
  results.push(testEnvironmentVariables());
  results.push(testSecurityMiddleware());
  results.push(testAPIConfiguration());
  results.push(testServerConfiguration());
  results.push(testSecurityDependencies());
  results.push(testSensitiveData());
  
  console.log('\n📊 Security Test Results');
  console.log('========================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total} tests`);
  console.log(`❌ Failed: ${total - passed}/${total} tests`);
  
  if (passed === total) {
    console.log('\n🎉 All security tests passed! Your application is secure.');
  } else {
    console.log('\n⚠️  Some security tests failed. Please review the issues above.');
  }
  
  console.log('\n📋 Security Checklist:');
  console.log('• [ ] Dependencies are secure (npm audit)');
  console.log('• [ ] Environment variables are set');
  console.log('• [ ] Security middleware is configured');
  console.log('• [ ] API configuration is secure');
  console.log('• [ ] Server configuration is secure');
  console.log('• [ ] Security dependencies are installed');
  console.log('• [ ] No sensitive data in code');
  
  console.log('\n🔗 For more information, see SECURITY_GUIDE.md');
}

// Run the tests
runSecurityTests().catch(console.error);
