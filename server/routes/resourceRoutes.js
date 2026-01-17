// Resource Routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Resource = require('../models/Resource');

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Protected
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      fileName,
      fileUrl,
      filePath,
      fileSize,
      fileType,
      subject,
      description,
      groupId,
    } = req.body;

    const uploadedBy = req.user.uid;

    const resource = await Resource.create({
      fileName,
      fileUrl,
      filePath,
      fileSize,
      fileType,
      subject,
      description,
      groupId,
      uploadedBy,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/user/:firebaseUid
// @desc    Get all resources uploaded by a user
// @access  Protected
router.get('/user/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const resources = await Resource.find({
      uploadedBy: req.params.firebaseUid,
    }).sort({ uploadedAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/group/:groupId
// @desc    Get all resources for a group
// @access  Protected
router.get('/group/:groupId', verifyToken, async (req, res) => {
  try {
    const resources = await Resource.find({
      groupId: req.params.groupId,
    }).sort({ uploadedAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching group resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources
// @desc    Get all resources (with optional filters)
// @access  Protected
router.get('/', verifyToken, async (req, res) => {
  try {
    const { subject, groupId } = req.query;
    const filter = {};

    if (subject) filter.subject = subject;
    if (groupId) filter.groupId = groupId;

    const resources = await Resource.find(filter).sort({ uploadedAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get resource by ID
// @access  Protected
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Protected
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Only uploader can delete
    if (resource.uploadedBy !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await resource.deleteOne();

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
