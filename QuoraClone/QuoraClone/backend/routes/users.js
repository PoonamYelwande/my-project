const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's questions
    const questions = await Question.find({ author: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    // Get user's answers
    const answers = await Answer.find({ author: req.params.id })
      .populate('author', 'username')
      .populate('question', 'title')
      .sort({ createdAt: -1 });

    res.json({
      user,
      questions,
      answers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    // Get user's questions
    const questions = await Question.find({ author: req.user._id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    // Get user's answers
    const answers = await Answer.find({ author: req.user._id })
      .populate('author', 'username')
      .populate('question', 'title')
      .sort({ createdAt: -1 });

    res.json({
      user,
      questions,
      answers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



