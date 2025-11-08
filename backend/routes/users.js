const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (for search/discovery)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('name email createdAt').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

