const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// Create answer
router.post('/', auth, async (req, res) => {
  try {
    const { content, questionId } = req.body;

    if (!content || !questionId) {
      return res.status(400).json({ message: 'Content and questionId are required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content,
      author: req.user._id,
      question: questionId
    });

    await answer.save();

    // Add answer to question
    question.answers.push(answer._id);
    await question.save();

    await answer.populate('author', 'username');
    await answer.populate('question');

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update answer
router.put('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    answer.content = req.body.content || answer.content;
    await answer.save();
    await answer.populate('author', 'username');
    await answer.populate('question');

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove answer from question
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Answer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



