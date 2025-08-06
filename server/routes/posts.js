const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate('author', 'name email avatar bio')
      .populate('likes.user', 'name email avatar')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ isActive: true });

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, validatePost, async (req, res) => {
  try {
    const { content } = req.body;

    const post = new Post({
      content,
      author: req.user.id
    });

    await post.save();
    await post.populate('author', 'name email avatar bio');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate('likes.user', 'name email avatar');

    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already liked by user
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id.toString()
    );

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ message: 'Post unliked', liked: false, likeCount: post.likes.length });
    } else {
      // Like the post
      post.likes.push({ user: req.user.id });
      await post.save();
      res.json({ message: 'Post liked', liked: true, likeCount: post.likes.length });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;