// Group Routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Group = require('../models/Group');

// @route   POST /api/groups
// @desc    Create a new group
// @access  Protected
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating group with data:', req.body);
    console.log('User UID:', req.user?.uid);
    
    const { groupName, subject, description, isPublic } = req.body;
    const createdBy = req.user.uid;

    if (!groupName) {
      return res.status(400).json({ error: 'Group name is required' });
    }
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const group = await Group.create({
      groupName,
      subject,
      description: description || '',
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy,
      members: [createdBy], // Creator is automatically a member
    });

    console.log('Group created successfully:', group._id);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/groups/user/:firebaseUid
// @desc    Get all groups for a user
// @access  Protected
router.get('/user/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.params.firebaseUid,
    }).sort({ createdAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/groups/:id
// @desc    Get group by ID
// @access  Protected
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/groups/:id/join
// @desc    Join a group
// @access  Protected
router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.uid)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    // Add user to members
    group.members.push(req.user.uid);
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/groups/:id/leave
// @desc    Leave a group
// @access  Protected
router.post('/:id/leave', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Remove user from members
    group.members = group.members.filter(uid => uid !== req.user.uid);
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Protected
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Only creator can update
    if (group.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { groupName, subject, description, isPublic } = req.body;

    group.groupName = groupName || group.groupName;
    group.subject = subject || group.subject;
    group.description = description !== undefined ? description : group.description;
    group.isPublic = isPublic !== undefined ? isPublic : group.isPublic;
    group.updatedAt = Date.now();

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Protected
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Only creator can delete
    if (group.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await group.deleteOne();

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
