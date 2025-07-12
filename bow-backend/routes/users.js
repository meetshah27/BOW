const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password -__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET user by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid }).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// GET user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST - Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a unique UID for the user
    const uid = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user (default role is 'member')
    const user = new User({
      uid,
      email: email.toLowerCase(),
      displayName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      role: 'member', // Default role
      isActive: true
    });

    const savedUser = await user.save();
    
    // Don't send password in response
    const userResponse = {
      uid: savedUser.uid,
      email: savedUser.email,
      displayName: savedUser.displayName,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      phone: savedUser.phone,
      role: savedUser.role,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST - Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check if user has a password (for email/password users)
    if (!user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last sign in
    user.lastSignIn = Date.now();
    await user.save();

    // Don't send password in response
    const userResponse = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      lastSignIn: user.lastSignIn,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// POST - Google Sign-in/Sign-up
router.post('/google', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ uid });
    
    if (user) {
      // User exists - update last sign in
      user.lastSignIn = Date.now();
      await user.save();
    } else {
      // Check if email already exists (for users who might have registered with email/password)
      const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
      
      if (existingUserByEmail) {
        // Email exists but with different UID - update the existing user
        existingUserByEmail.uid = uid;
        existingUserByEmail.displayName = displayName || existingUserByEmail.displayName;
        existingUserByEmail.photoURL = photoURL;
        existingUserByEmail.lastSignIn = Date.now();
        user = await existingUserByEmail.save();
      } else {
        // Create new user
        user = new User({
          uid,
          email: email.toLowerCase(),
          displayName: displayName || email,
          photoURL,
          role: 'member', // Default role
          isActive: true
        });
        await user.save();
      }
    }

    // Don't send password in response
    const userResponse = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      photoURL: user.photoURL,
      role: user.role,
      isActive: user.isActive,
      lastSignIn: user.lastSignIn,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Google authentication successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
});

// PUT - Update user (admin can update roles)
router.put('/:uid', async (req, res) => {
  try {
    const { firstName, lastName, phone, role, isActive } = req.body;
    
    // Only allow role updates if user is admin (you can add admin check here)
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Update displayName if firstName or lastName changed
    if (firstName || lastName) {
      const user = await User.findOne({ uid: req.params.uid });
      if (user) {
        const newFirstName = firstName || user.firstName || '';
        const newLastName = lastName || user.lastName || '';
        updateData.displayName = `${newFirstName} ${newLastName}`.trim();
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE - Deactivate user (soft delete)
router.delete('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { isActive: false },
      { new: true }
    ).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'User deactivated successfully',
      user: user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Failed to deactivate user' });
  }
});

// POST - Reactivate user
router.post('/:uid/reactivate', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { isActive: true },
      { new: true }
    ).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'User reactivated successfully',
      user: user
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Failed to reactivate user' });
  }
});

// GET - User statistics (admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
    const memberUsers = await User.countDocuments({ role: 'member', isActive: true });
    
    // Users registered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth },
      isActive: true
    });

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      memberUsers,
      newUsersThisMonth,
      inactiveUsers: totalUsers - activeUsers
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
