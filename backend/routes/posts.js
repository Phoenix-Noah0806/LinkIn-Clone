const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Create a post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Debug: Log request body to see what multer parsed
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File exists' : 'No file');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Get text from body
    // When using FormData (with image), multer puts text in req.body.text
    // When using JSON (no image), express.json() puts it in req.body.text
    let text = req.body?.text;
    
    // If text is not found, check if it's in the body directly
    if (!text && typeof req.body === 'object') {
      // Try to get text from body object
      text = req.body.text || req.body['text'];
    }
    
    // Handle case where text might be an array (multer sometimes does this)
    if (Array.isArray(text)) {
      text = text[0];
    }
    
    // Convert to string if it's not already
    if (text && typeof text !== 'string') {
      text = String(text);
    }

    if (!text || (typeof text === 'string' && text.trim().length === 0)) {
      // If there's an uploaded file but no text, delete the file
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Post text is required' });
    }

    const postData = {
      user: req.user._id,
      text: text.trim()
    };

    // Add image path if file was uploaded
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = new Post(postData);
    await post.save();
    await post.populate('user', 'name email');

    res.status(201).json(post);
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike a post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.some(
      like => like.toString() === req.user._id.toString()
    );

    if (isLiked) {
      post.likes = post.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('user', 'name email');
    await post.populate('likes', 'name');
    await post.populate('comments.user', 'name');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim()
    });

    await post.save();
    await post.populate('user', 'name email');
    await post.populate('likes', 'name');
    await post.populate('comments.user', 'name');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a post (only by owner)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Post text is required' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.text = text.trim();
    
    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (post.image) {
        const fs = require('fs');
        const path = require('path');
        const oldImagePath = path.join(__dirname, '..', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    await post.populate('user', 'name email');
    await post.populate('likes', 'name');
    await post.populate('comments.user', 'name');

    res.json(post);
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a post (only by owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated image if it exists
    if (post.image) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

