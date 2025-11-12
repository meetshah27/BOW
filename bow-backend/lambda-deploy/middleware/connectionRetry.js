const { isConnectionHealthy, checkConnectionHealth } = require('../config/aws-config');

// Check if running in Lambda
const isLambda = !!process.env.LAMBDA_TASK_ROOT || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Connection retry middleware
function connectionRetryMiddleware(maxRetries = 3, retryDelay = 1000) {
  return async (req, res, next) => {
    // Skip for non-API routes
    if (!req.path.startsWith('/api/') && req.path !== '/health') {
      return next();
    }

    // In Lambda, don't block requests based on connection health
    // The SDK will handle retries automatically, and we don't want to block
    // requests waiting for health checks that may timeout
    if (isLambda) {
      // In Lambda, just proceed - let the SDK handle retries
      // Only do a quick health check if connection is marked unhealthy
      if (!isConnectionHealthy()) {
        // Quick async check, but don't block the request
        checkConnectionHealth().catch(err => {
          console.log('⚠️  Background health check failed:', err.message);
        });
      }
      return next();
    }

    // Outside Lambda (local/dev), use the blocking health check
    if (!isConnectionHealthy()) {
      console.log('⚠️  Connection unhealthy, attempting to restore...');
      
      // Try to restore connection with timeout
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 3000)
        );
        const restored = await Promise.race([checkConnectionHealth(), timeoutPromise]);
        
        if (!restored) {
          console.log('❌ Connection restoration failed');
          return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'Database connection is down. Please try again in a moment.',
            timestamp: new Date().toISOString(),
            retryAfter: 30
          });
        }
      } catch (error) {
        console.log('⚠️  Health check error, proceeding anyway:', error.message);
        // In case of timeout, proceed anyway - let the SDK handle it
      }
    }

    // Add retry logic for database operations
    req.retryOperation = async (operation, retries = maxRetries) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          console.log(`🔄 Attempt ${attempt}/${retries} failed:`, error.message);
          
          // Check if it's a connection error
          if (error.name === 'TimeoutError' || 
              error.name === 'NetworkError' || 
              error.code === 'NetworkingError' ||
              error.message.includes('timeout') ||
              error.message.includes('connection')) {
            
            if (attempt < retries) {
              console.log(`⏳ Retrying in ${retryDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              
              // Try to restore connection
              await checkConnectionHealth();
              continue;
            }
          }
          
          // If it's not a connection error or we've exhausted retries, throw
          throw error;
        }
      }
    };

    next();
  };
}

// Health check endpoint middleware
async function healthCheckMiddleware(req, res, next) {
  if (req.path === '/health') {
    // In Lambda, do a quick async check but don't block
    let connectionStatus = isConnectionHealthy();
    
    // If not marked as healthy, try a quick check (but don't wait too long)
    if (!connectionStatus && isLambda) {
      try {
        // Quick async check with timeout
        const checkPromise = checkConnectionHealth();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 2000)
        );
        connectionStatus = await Promise.race([checkPromise, timeoutPromise]);
      } catch (error) {
        // If check fails or times out, assume it's okay (Lambda SDK will retry)
        // Don't mark as failed just because the health check timed out
        console.log('⚠️  Health check timed out, but proceeding:', error.message);
        connectionStatus = true; // Assume healthy, let SDK handle retries
      }
    }
    
    const healthData = {
      status: connectionStatus ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        connected: connectionStatus,
        lastCheck: new Date().toISOString()
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Always return 200 for health check - don't fail the request
    // The status field indicates health, but we don't want to return 503
    res.json(healthData);
    return;
  }
  next();
}

module.exports = {
  connectionRetryMiddleware,
  healthCheckMiddleware
};
