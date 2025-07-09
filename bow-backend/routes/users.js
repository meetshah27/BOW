const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user with email/password (registration)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
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

    const user = new User({
      uid,
      email,
      displayName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      role: 'member'
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
      createdAt: savedUser.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST sign in with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
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
      lastSignIn: user.lastSignIn
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user (sign up)
router.post('/signup', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, role = 'member' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      uid,
      email,
      displayName,
      photoURL,
      role
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST sign in (update last sign in)
router.post('/signin', async (req, res) => {
  try {
    const { uid } = req.body;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last sign in
    user.lastSignIn = Date.now();
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user
router.put('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user (soft delete)
router.delete('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { isActive: false },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
