# Beats of Washington Platform - Setup Guide

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your_app_id_here

   # Stripe Configuration (for donations)
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

## 🔧 Configuration Steps

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Google Sign-In
4. Get your project configuration from Project Settings
5. Add the configuration to your `.env` file

### Stripe Setup (Optional)
1. Create a [Stripe account](https://stripe.com/)
2. Get your publishable key from the Dashboard
3. Add it to your `.env` file

### AWS Amplify Setup (Optional)
1. Install AWS Amplify CLI: `npm install -g @aws-amplify/cli`
2. Configure Amplify: `amplify configure`
3. Initialize Amplify in your project: `amplify init`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI elements
│   └── layout/         # Layout components (Navbar, Footer)
├── config/             # Configuration files
├── contexts/           # React contexts
├── pages/              # Page components
└── utils/              # Utility functions
```

## 🎨 Features Implemented

### ✅ Core Features
- [x] Responsive design with Tailwind CSS
- [x] Google Sign-In authentication
- [x] Protected routes for admin/member areas
- [x] Modern navigation with mobile support
- [x] SEO optimization with React Helmet

### ✅ Pages
- [x] Homepage with hero section and stats
- [x] About page with mission and leadership
- [x] Events page with filtering and search
- [x] Gallery with photo/video management
- [x] Get Involved page with volunteer opportunities
- [x] Donation page with Stripe integration
- [x] Contact page with form and info
- [x] People Stories page with testimonials
- [x] Login page with Google authentication
- [x] Admin Panel with management tools
- [x] Member Portal with personalized dashboard
- [x] 404 Not Found page

### ✅ Admin Features
- [x] Dashboard with analytics
- [x] Event management
- [x] User management
- [x] Content management
- [x] Analytics and reporting

### ✅ Member Features
- [x] Personalized dashboard
- [x] Event registration tracking
- [x] Profile management
- [x] Activity history

## 🚀 Deployment

### AWS Amplify (Recommended)
1. Push your code to GitHub
2. Connect your repository to AWS Amplify
3. Configure build settings
4. Deploy automatically

### Other Platforms
- **Vercel**: Connect GitHub repo and deploy
- **Netlify**: Drag and drop or connect Git repo
- **Firebase Hosting**: Use Firebase CLI to deploy

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Implement proper authentication and authorization
- Regular security audits and updates

## 📞 Support

For questions or issues:
- Check the documentation
- Review the code comments
- Contact the development team

## 🎯 Next Steps

1. **Customize Content**: Update text, images, and branding
2. **Configure Firebase**: Set up authentication and database
3. **Add Real Data**: Replace mock data with actual content
4. **Test Thoroughly**: Test all features and user flows
5. **Deploy**: Choose a hosting platform and deploy
6. **Monitor**: Set up analytics and monitoring

---

**Built with ❤️ for the Beats of Washington community** 