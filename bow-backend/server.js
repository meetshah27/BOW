const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const securityMiddleware = require('./middleware/security');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const paymentRouter = require('./routes/payment');
const eventsRouter = require('./routes/events');
const volunteersRouter = require('./routes/volunteers');
const storiesRouter = require('./routes/stories');
const galleryRouter = require('./routes/gallery');
const newsletterRouter = require('./routes/newsletter');
const newsletterCampaignRouter = require('./routes/newsletter-campaigns');
const volunteerOpportunitiesRouter = require('./routes/volunteer-opportunities');

const app = express();

// Apply security middleware
securityMiddleware(app);

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

// Test DynamoDB connection
try {
  const { docClient } = require('./config/dynamodb');
  console.log('✅ DynamoDB client initialized');
  console.log('📊 Using AWS Region:', process.env.AWS_REGION || 'us-west-2');
  console.log('🎯 All models connected to DynamoDB');
} catch (error) {
  console.log('⚠️  DynamoDB not configured, using fallback mode');
  console.log('💡 To enable DynamoDB, set AWS credentials in .env file');
}

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
// Serve only essential static files (not uploaded content)
app.use('/sponsors', express.static(path.join(__dirname, 'public/sponsors')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public/favicon.ico')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/events', eventsRouter);
app.use('/api/volunteers', volunteersRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/newsletter', newsletterCampaignRouter);
app.use('/api/volunteer-opportunities', volunteerOpportunitiesRouter);
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
app.listen(PORT, () => {
  console.log(`🚀 BOW backend server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
})};

module.exports = app;
