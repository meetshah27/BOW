const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const paymentRouter = require('./routes/payment');
const eventsRouter = require('./routes/events');
const volunteersRouter = require('./routes/volunteers');

const app = express();

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bowdb';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database URI:', mongoURI);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 To fix this:');
  console.log('   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
  console.log('   2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
  console.log('   3. Or set MONGO_URI environment variable to your MongoDB connection string');
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/events', eventsRouter);
app.use('/api/volunteers', volunteersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BOW backend server running on http://localhost:${PORT}`);
});

module.exports = app;
