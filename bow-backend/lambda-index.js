// Lambda Entry Point for BOW Backend
// This file should be copied to index.js in the Lambda console

exports.handler = async (event, context) => {
  try {
    console.log('🚀 BOW Backend Lambda started');
    console.log('📝 Event:', JSON.stringify(event, null, 2));
    
    // Extract path and method
    const path = event.path || event.rawPath || '/health';
    const method = event.httpMethod || event.requestContext?.http?.method || 'GET';
    
    console.log(`📡 Request: ${method} ${path}`);
    
    // Handle health check
    if (path === '/health' || path === '/default/bow-backend-clean/health' || path.endsWith('/health')) {
      console.log('❤️ Health check requested');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        },
        body: JSON.stringify({
          status: 'OK',
          timestamp: new Date().toISOString(),
          environment: 'production',
          message: 'BOW Backend is running with security features!',
          path: path,
          method: method,
          version: '1.0.0'
        })
      };
    }
    
    // Handle API routes
    if (path.startsWith('/api/')) {
      console.log('🔌 API route requested');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'BOW API endpoint active',
          path: path,
          method: method,
          timestamp: new Date().toISOString(),
          note: 'Full API routes will be integrated soon'
        })
      };
    }
    
    // Default response
    console.log('🌐 Default response');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'BOW Backend Lambda is working!',
        path: path,
        method: method,
        timestamp: new Date().toISOString(),
        availableEndpoints: ['/health', '/api/*']
      })
    };
    
  } catch (error) {
    console.error('❌ Lambda error:', error);
    console.error('📍 Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
