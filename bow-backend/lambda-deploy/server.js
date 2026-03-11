const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const securityMiddleware = require('./middleware/security');
const { connectionRetryMiddleware, healthCheckMiddleware } = require('./middleware/connectionRetry');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const paymentRouter = require('./routes/payment');
const squareConfigRouter = require('./routes/square-config');
const eventsRouter = require('./routes/events');
const volunteersRouter = require('./routes/volunteers');
const storiesRouter = require('./routes/stories');
const galleryRouter = require('./routes/gallery');
const newsletterRouter = require('./routes/newsletter');
const newsletterCampaignRouter = require('./routes/newsletter-campaigns');
const volunteerOpportunitiesRouter = require('./routes/volunteer-opportunities');
const leadersRouter = require('./routes/leaders');
const aboutPageRouter = require('./routes/about-page');
const founderContentRouter = require('./routes/founder-content');
const culturalQuotesRouter = require('./routes/cultural-quotes');
const storiesMediaRouter = require('./routes/stories-media');
const membershipsRouter = require('./routes/memberships');
const settingsRouter = require('./routes/settings');
const sponsorsRouter = require('./routes/sponsors');

const app = express();

// Trust only the first proxy (API Gateway / CloudFront) to satisfy express-rate-limit safety checks
app.set('trust proxy', 1);

// Apply security middleware
securityMiddleware(app);

// Apply connection retry middleware
app.use(connectionRetryMiddleware());

// Enable CORS for all routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin === 'http://localhost:3001' || origin === 'http://localhost:3000') {
      return callback(null, true);
    }
    
    // Allow Amplify domains
    if (origin.includes('amplifyapp.com') || origin.includes('amplify.amazonaws.com')) {
      return callback(null, true);
    }
    
    // Allow any other domains (you can restrict this in production)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// DynamoDB Configuration
console.log('🔍 Environment check:');
console.log('   AWS_REGION:', process.env.AWS_REGION || 'us-west-2');
console.log('   AWS_ACCESS_KEY_ID set:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('   AWS_SECRET_ACCESS_KEY set:', !!process.env.AWS_SECRET_ACCESS_KEY);

// Test DynamoDB connection with enhanced error handling
try {
  const { docClient, isConnectionHealthy } = require('./config/dynamodb');
  const { checkConnectionHealth } = require('./config/aws-config');
  
  console.log('✅ DynamoDB client initialized');
  console.log('📊 Using AWS Region:', process.env.AWS_REGION || 'us-west-2');
  console.log('🎯 All models connected to DynamoDB');
  
  // Initial connection test
  checkConnectionHealth().then(healthy => {
    if (healthy) {
      console.log('✅ Initial DynamoDB connection test successful');
    } else {
      console.log('⚠️  Initial DynamoDB connection test failed');
    }
  });
} catch (error) {
  console.log('⚠️  DynamoDB not configured, using fallback mode');
  console.log('💡 To enable DynamoDB, set AWS credentials in .env file');
}

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));

// Special handling for Stripe webhooks - must be raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Safe JSON parsing for all other routes with Lambda fallback
const jsonParser = express.json({ limit: '10mb' });
app.use((req, res, next) => {
  jsonParser(req, res, (err) => {
    if (!err) {
      return next();
    }

    // Handle Lambda re-use where the stream was already consumed (e.g., by serverless adapter)
    const isStreamNotReadable = err && err.message && err.message.includes('stream is not readable');
    if (isStreamNotReadable) {
      try {
        let event = req.apiGateway?.event;

        if (!event) {
          try {
            const { getCurrentInvoke } = require('@vendia/serverless-express');
            event = getCurrentInvoke()?.event;
          } catch (invokeError) {
            console.warn('⚠️  Unable to access serverless invoke context:', invokeError.message);
          }
        }

        if (event && typeof event.body === 'string') {
          const bodyString = event.isBase64Encoded
            ? Buffer.from(event.body, 'base64').toString('utf-8')
            : event.body;
          req.body = bodyString ? JSON.parse(bodyString) : {};
          console.log('ℹ️  Fallback JSON parsing applied using apiGateway event body');
          return next();
        }
      } catch (parseError) {
        console.error('❌ Fallback JSON parsing failed:', parseError.message);
        return next(parseError);
      }
    }

    return next(err);
  });
});
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
// Serve only essential static files (not uploaded content)
app.use('/sponsors', express.static(path.join(__dirname, 'public/sponsors')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public/favicon.ico')));

// Health check endpoint with enhanced monitoring
app.use(healthCheckMiddleware);

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api', squareConfigRouter);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/events', eventsRouter);
app.use('/api/volunteers', volunteersRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/newsletter', newsletterCampaignRouter);
app.use('/api/volunteer-opportunities', volunteerOpportunitiesRouter);
app.use('/api/leaders', leadersRouter);
app.use('/api/about-page', aboutPageRouter);
app.use('/api/founder-content', founderContentRouter);
app.use('/api/cultural-quotes', culturalQuotesRouter);
app.use('/api/stories-media', storiesMediaRouter);
app.use('/api/memberships', membershipsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/sponsors', sponsorsRouter);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));

// Handle missing sponsor images gracefully
app.get('/sponsors/*', (req, res) => {
  console.log(`📸 Sponsor image not found: ${req.path}`);
  res.status(404).json({ 
    message: 'Sponsor image not found',
    path: req.path,
    tip: 'Add the image file to the public/sponsors directory'
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log the error
  console.error('❌ Server error:', err.message);
  console.error('📍 URL:', req.url);
  console.error('📅 Timestamp:', new Date().toISOString());
  if (err.stack) {
    console.error('🧵 Stack trace:', err.stack);
  }

  // render the error page
  res.status(err.status || 500);
  res.json({ 
    error: err.message,
    status: err.status || 500,
    timestamp: new Date().toISOString(),
    path: req.url
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  
  // Enhanced server configuration
  const server = app.listen(PORT, () => {
    console.log(`🚀 BOW backend server running on http://localhost:${PORT}`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Connection monitoring enabled`);
  });
  
  // Enhanced server settings for connection stability
  server.keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 120000; // 2 minutes instead of 65 seconds
  server.headersTimeout = parseInt(process.env.HEADERS_TIMEOUT) || 125000; // Slightly higher than keepAliveTimeout
  
  // Handle server errors
  server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.error('💡 Port is already in use. Try a different port or stop the existing service.');
    }
  });
  
  // Handle connection events
  server.on('connection', (socket) => {
    console.log('🔌 New connection established');
    
    // Set socket timeout - Increased for stability
    socket.setTimeout(parseInt(process.env.SOCKET_TIMEOUT) || 120000); // 2 minutes instead of 30 seconds
    
    // Enable TCP keep-alive
    socket.setKeepAlive(true, 60000); // 1 minute
    
    socket.on('timeout', () => {
      console.log('⏰ Socket timeout, closing connection');
      socket.destroy();
    });
    
    socket.on('error', (error) => {
      console.error('🔌 Socket error:', error.message);
    });
    
    socket.on('close', (hadError) => {
      if (hadError) {
        console.log('🔌 Connection closed due to error');
      } else {
        console.log('🔌 Connection closed normally');
      }
    });
  });
  
  console.log(`🔧 Server configured with keep-alive timeout: ${server.keepAliveTimeout}ms`);
  console.log(`🔧 Server configured with headers timeout: ${server.headersTimeout}ms`);
  console.log(`🔧 Socket timeout: ${parseInt(process.env.SOCKET_TIMEOUT) || 120000}ms`);
}

module.exports = app;
