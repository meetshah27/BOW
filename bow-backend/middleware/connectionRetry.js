const { isConnectionHealthy, checkConnectionHealth } = require('../config/aws-config');

// Connection retry middleware
function connectionRetryMiddleware(maxRetries = 3, retryDelay = 1000) {
  return async (req, res, next) => {
    // Skip for non-API routes
    if (!req.path.startsWith('/api/') && req.path !== '/health') {
      return next();
    }

    // Check connection health before processing
    if (!isConnectionHealthy()) {
      console.log('⚠️  Connection unhealthy, attempting to restore...');
      
      // Try to restore connection
      const restored = await checkConnectionHealth();
      if (!restored) {
        console.log('❌ Connection restoration failed');
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          message: 'Database connection is down. Please try again in a moment.',
          timestamp: new Date().toISOString(),
          retryAfter: 30
        });
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
function healthCheckMiddleware(req, res, next) {
  if (req.path === '/health') {
    const connectionStatus = isConnectionHealthy();
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

    if (connectionStatus) {
      res.json(healthData);
    } else {
      res.status(503).json(healthData);
    }
    return;
  }
  next();
}

module.exports = {
  connectionRetryMiddleware,
  healthCheckMiddleware
};
