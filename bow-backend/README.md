# BOW Backend API

Backend API server for Beats of Washington (BOW) platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:3000` by default.

## 📁 Project Structure

```
bow-backend/
├── config/           # Configuration files
├── models/           # MongoDB models (legacy)
├── models-dynamodb/  # DynamoDB models
├── routes/           # API routes
├── public/           # Static files
├── server.js         # Main server file
├── start.js          # Startup script
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# AWS DynamoDB Configuration (optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# MongoDB Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/bow

# Other Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

## 🗄️ Database

The backend supports both MongoDB and DynamoDB:

### DynamoDB (Recommended)
- Set up AWS credentials in `.env`
- Tables will be created automatically
- Better scalability and performance

### MongoDB (Legacy)
- Set `MONGODB_URI` in `.env`
- Requires local MongoDB installation
- Used for development/testing

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `GET /users` - Get all users
- `GET /users/:uid` - Get user by UID
- `GET /users/email/:email` - Get user by email
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/google` - Google authentication

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/user/:userId/registrations` - Get user registrations
- `GET /api/events/ticket/:ticketNumber` - Get registration by ticket

### Volunteers
- `GET /api/volunteers/opportunities` - Get volunteer opportunities
- `POST /api/volunteers/apply` - Submit volunteer application
- `GET /api/volunteers/applications` - Get all applications (admin)
- `GET /api/volunteers/applications/:id` - Get application by ID

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/founders` - Get all founders

## 🛠️ Development

### Available Scripts

```bash
# Start server with enhanced startup
npm start

# Start with nodemon for development
npm run start-dev

# Start server directly
npm run server

# Start with nodemon (legacy)
npm run dev
```

### Database Setup

#### DynamoDB Setup
1. Create AWS account and get credentials
2. Set up DynamoDB tables:
   ```bash
   node scripts/create-tables.js
   ```
3. Seed sample data:
   ```bash
   node scripts/seed-dynamodb.js
   ```

#### MongoDB Setup
1. Install MongoDB locally
2. Set `MONGODB_URI` in `.env`
3. Seed sample data:
   ```bash
   node seed.js
   ```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Missing script: start"
- Run `npm install` first
- Check if `package.json` has the start script

#### 2. AWS Credentials Error
- Set up AWS credentials in `.env`
- Or use fallback mode (server will work with sample data)

#### 3. MongoDB Connection Timeout
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Server will use fallback data if MongoDB is unavailable

#### 4. Sponsor Images 404
- Add sponsor images to `public/sponsors/` directory
- Or the server will return a helpful error message

### Error Handling

The server includes comprehensive error handling:
- Graceful fallbacks to sample data
- Detailed error logging
- Health check endpoint
- Graceful shutdown handling

### Logs

Check the console output for:
- ✅ Success messages
- ⚠️ Warning messages
- ❌ Error messages
- 📸 Missing resource notifications

## 🚀 Production Deployment

### Environment Variables
Set `NODE_ENV=production` and configure:
- AWS credentials for DynamoDB
- Stripe keys for payments
- Google OAuth credentials

### Health Monitoring
Use the `/health` endpoint for monitoring:
```bash
curl http://localhost:3000/health
```

### Performance
- Request size limit: 10MB
- CORS enabled for frontend domains
- Graceful error handling
- Fallback data for reliability

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment variables
3. Test the health endpoint
4. Check database connectivity

The server is designed to be stable and provide a good user experience even when some services are unavailable. 