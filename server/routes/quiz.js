const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { authAdmin, authUser } = require('../middleware/auth');

// Get all quiz questions (requires login)
router.get('/questions', authUser, async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new quiz question (admin only)
router.post('/questions', authAdmin, async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  if (!question || !options || !correctAnswer || !Array.isArray(options)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }
  const quiz = new Quiz({ question, options, correctAnswer });
  try {
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a quiz question (admin only)
router.delete('/questions/:id', authAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Question not found' });
    await quiz.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save quiz score (requires login)
router.post('/scores', authUser, async (req, res) => {
    const { answers, totalScore } = req.body;
    console.log('Received score data:', { answers, totalScore, userId: req.user.id });
    if (!answers || typeof totalScore !== 'number') {
      return res.status(400).json({ message: 'Invalid score data' });
    }
    try {
      const score = new Score({
        userId: req.user.id,
        answers,
        totalScore
      });
      const savedScore = await score.save();
      res.status(201).json(savedScore);
    } catch (err) {
      console.error('Error saving score in backend:', err);
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;