const express = require('express');
const Challenge = require('../models/Challenge');
const Location = require('../models/Location');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get challenge for a location
router.get('/location/:locationId', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ locationId: req.params.locationId })
      .populate('challengeId');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Don't send the answer to the client
    const challenge = location.challengeId.toObject();
    delete challenge.answer;

    res.json({
      challengeId: challenge._id,
      type: challenge.type,
      question: challenge.question,
      options: challenge.options,
      hint: challenge.hint,
      points: challenge.points,
      difficulty: challenge.difficulty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit answer
router.post('/submit', auth, async (req, res) => {
  try {
    const { locationId, answer } = req.body;

    const location = await Location.findOne({ locationId })
      .populate('challengeId');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if already completed
    const userCompletedIds = req.user.locationsCompleted.map(id => id.toString());
    if (userCompletedIds.includes(location._id.toString())) {
      return res.status(400).json({ message: 'Location already completed' });
    }

    // Check answer (case-insensitive, trimmed)
    const isCorrect = location.challengeId.answer.trim().toLowerCase() === answer.trim().toLowerCase();

    if (isCorrect) {
      // Update user progress
      req.user.points += location.points;
      req.user.badges.push(location.badge);
      req.user.locationsCompleted.push(location._id);
      await req.user.save();

      res.json({
        correct: true,
        message: 'Challenge completed!',
        pointsEarned: location.points,
        badge: location.badge,
        totalPoints: req.user.points
      });
    } else {
      res.json({
        correct: false,
        message: 'Incorrect answer. Try again!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

