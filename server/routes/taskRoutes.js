// Task Routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Protected
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, subject, dueDate, priority, groupId, assignedTo } = req.body;
    const createdBy = req.user.uid;

    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      subject: subject || 'General',
      dueDate,
      priority: priority || 'medium',
      groupId: groupId || null,
      assignedTo: assignedTo || [createdBy],
      createdBy,
      status: 'pending',
    });

    console.log('Task created successfully:', task._id);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tasks/user/:firebaseUid
// @desc    Get all tasks for a user
// @access  Protected
router.get('/user/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.params.firebaseUid,
    }).sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tasks/group/:groupId
// @desc    Get all tasks for a group
// @access  Protected
router.get('/group/:groupId', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({
      groupId: req.params.groupId,
    }).sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching group tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Protected
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task status (pending/completed)
// @access  Protected
router.patch('/:id/toggle', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle status
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    task.updatedAt = Date.now();
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Protected
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, dueDate, priority, status } = req.body;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.updatedAt = Date.now();

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task status
// @access  Protected
router.patch('/:id/toggle', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    task.updatedAt = Date.now();
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Protected
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only creator can delete
    if (task.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
