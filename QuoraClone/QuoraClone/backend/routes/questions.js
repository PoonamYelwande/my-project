const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all questions (latest first)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username' }
      })
      .sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username' }
      });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create question
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const question = new Question({
      title,
      description: description || '',
      author: req.user._id
    });

    await question.save();
    await question.populate('author', 'username');

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update question
router.put('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.title = req.body.title || question.title;
    question.description = req.body.description || question.description;
    
    await question.save();
    await question.populate('author', 'username');

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all answers for this question
    await Answer.deleteMany({ question: question._id });

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



