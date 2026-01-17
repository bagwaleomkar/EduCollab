// User Routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST /api/users
// @desc    Create or update user after Firebase signup
// @access  Protected
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating/updating user. Body:', req.body);
    console.log('Firebase UID from token:', req.user?.uid);
    
    const { name, email, role, photoURL } = req.body;
    const firebaseUid = req.user.uid;

    // Check if user exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      user.updatedAt = Date.now();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        name,
        email,
        role: role || 'student',
        photoURL,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:firebaseUid
// @desc    Get user by Firebase UID
// @access  Protected
router.get('/:firebaseUid', verifyToken, async (req, res) => {
  try {
    console.log('Fetching user with UID:', req.params.firebaseUid);
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/:firebaseUid
// @desc    Update user profile
// @access  Protected
router.put('/:firebaseUid', verifyToken, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.uid !== req.params.firebaseUid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, photoURL } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { name, photoURL, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
