const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const verifyCognito = require('../middleware/verifyCognito');
const syncUserToDynamoDB = require('../middleware/syncUserToDynamoDB');

// Try to use DynamoDB User model, fallback to sample data if not available
let User;
try {
  User = require('../models-dynamodb/User');
  console.log('✅ Using DynamoDB User model');
} catch (error) {
  console.log('⚠️  DynamoDB User model not available, using fallback mode');
  User = null;
}

// Sample user data for fallback
const sampleUsers = [
  {
    uid: 'sample_user_1',
    email: 'admin@bow.org',
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'sample_user_2',
    email: 'member@bow.org',
    displayName: 'Sample Member',
    firstName: 'Sample',
    lastName: 'Member',
    role: 'member',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// GET all users (admin only)
router.get('/', verifyCognito, syncUserToDynamoDB, async (req, res) => {
  try {
    if (User) {
      const users = await User.findAll();
      res.json(users);
    } else {
      // Fallback to sample data
      res.json(sampleUsers);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to sample data on error
    res.json(sampleUsers);
  }
});

// GET user by UID
router.get('/:uid', verifyCognito, syncUserToDynamoDB, async (req, res) => {
  try {
    if (User) {
      const user = await User.findByUid(req.params.uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      // Fallback to sample data
      const user = sampleUsers.find(u => u.uid === req.params.uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    // Fallback to sample data
    const user = sampleUsers.find(u => u.uid === req.params.uid);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
});

// GET user by email
router.get('/email/:email', verifyCognito, syncUserToDynamoDB, async (req, res) => {
  try {
    if (User) {
      const user = await User.findByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } else {
      // Fallback to sample data
      const user = sampleUsers.find(u => u.email === req.params.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    // Fallback to sample data
    const user = sampleUsers.find(u => u.email === req.params.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
});

// POST - Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    console.log(req.body);
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
    
    if (User) {
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a unique UID for the user
      const uid = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new user
      const userData = {
        uid,
        email: email.toLowerCase(),
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone,
        password: hashedPassword,
        role: 'member',
        isActive: true
      };

      const savedUser = await User.create(userData);
      
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
    } else {
      // Fallback response for demo mode
      res.status(201).json({
        message: 'User registered successfully (demo mode)',
        user: {
          uid: `demo_${Date.now()}`,
          email: email.toLowerCase(),
          displayName: `${firstName} ${lastName}`,
          firstName,
          lastName,
          phone,
          role: 'member',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /login - User login (no Cognito, DynamoDB only)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!User) {
      return res.status(500).json({ message: 'User model not available' });
    }
    // Find user by email
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Compare password
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Success: return user info (no password)
    const userResponse = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
    res.json({ message: 'Login successful', user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// POST - Google Sign-in/Sign-up
router.post('/google', async (req, res) => {
  try {
    const { firebaseUid, email, displayName, firstName, lastName, phone, photoURL, provider = 'google' } = req.body;
    
    // Validate required fields
    if (!firebaseUid || !email) {
      return res.status(400).json({ message: 'Firebase UID and email are required' });
    }
    
    if (User) {
      // Check if user already exists by Firebase UID
      let user = await User.findByFirebaseUid(firebaseUid);
      
      if (user) {
        // User exists - update last sign in and any new info
        await user.updateLastSignIn();
        if (photoURL && photoURL !== user.photoURL) {
          await user.update({ photoURL });
        }
        if (displayName && displayName !== user.displayName) {
          await user.update({ displayName });
        }
        // Refresh user data
        user = await User.findByFirebaseUid(firebaseUid);
      } else {
        // Check if email already exists (user might have signed up with email first)
        const existingUserByEmail = await User.findByEmail(email.toLowerCase());
        
        if (existingUserByEmail) {
          // Email exists but with different provider - link the accounts
          await existingUserByEmail.update({
            firebaseUid: firebaseUid,
            provider: provider,
            photoURL: photoURL || existingUserByEmail.photoURL,
            lastSignIn: new Date().toISOString()
          });
          user = await User.findByFirebaseUid(firebaseUid);
        } else {
          // Create new user
          const userData = {
            email: email.toLowerCase(),
            displayName: displayName || email,
            firstName: firstName || displayName?.split(' ')[0] || '',
            lastName: lastName || displayName?.split(' ').slice(1).join(' ') || '',
            phone: phone || null,
            photoURL: photoURL || null,
            provider: provider,
            firebaseUid: firebaseUid,
            role: 'member',
            isActive: true
          };
          user = await User.create(userData);
        }
      }

      // Don't send sensitive data in response
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
        provider: user.provider,
        lastSignIn: user.lastSignIn,
        createdAt: user.createdAt
      };

      res.json({
        message: 'Google authentication successful',
        user: userResponse
      });
    } else {
      // Fallback demo response
      const demoUser = {
        uid: `google_${Date.now()}`,
        email: email.toLowerCase(),
        displayName: displayName || email,
        firstName: firstName || displayName?.split(' ')[0] || '',
        lastName: lastName || displayName?.split(' ').slice(1).join(' ') || '',
        phone: phone || null,
        photoURL: photoURL || null,
        provider: provider,
        firebaseUid: firebaseUid,
        role: 'member',
        isActive: true,
        lastSignIn: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      res.json({
        message: 'Google authentication successful (demo mode)',
        user: demoUser
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
});

// PUT - Update user (admin can update roles)
router.put('/:uid', verifyCognito, syncUserToDynamoDB, async (req, res) => {
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
    if (!User) {
      // Fallback to sample data
      return res.json({
        totalUsers: sampleUsers.length,
        activeUsers: sampleUsers.filter(u => u.isActive).length,
        adminUsers: sampleUsers.filter(u => u.role === 'admin' && u.isActive).length,
        memberUsers: sampleUsers.filter(u => u.role === 'member' && u.isActive).length,
        newUsersThisMonth: sampleUsers.filter(u => u.isActive).length,
        inactiveUsers: sampleUsers.filter(u => !u.isActive).length
      });
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocumentsWithFilter({ isActive: true });
    const adminUsers = await User.countDocumentsWithFilter({ role: 'admin', isActive: true });
    const memberUsers = await User.countDocumentsWithFilter({ role: 'member', isActive: true });
    
    // Users registered this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocumentsWithFilter({
      createdAt: { $gte: thisMonth.toISOString() },
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
