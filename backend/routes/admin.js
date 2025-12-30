const express = require('express');
const Location = require('../models/Location');
const Challenge = require('../models/Challenge');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(auth);
router.use(adminAuth);

// Create location
router.post('/locations', async (req, res) => {
  try {
    const { locationId, name, country, coordinates, challengeId, points, badge, locked, unlockRequirement } = req.body;
    
    const location = new Location({
      locationId,
      name,
      country,
      coordinates,
      challengeId,
      points: points || 50,
      badge,
      locked: locked || false,
      unlockRequirement: unlockRequirement || 0
    });

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create challenge
router.post('/challenges', async (req, res) => {
  try {
    const { challengeId, type, question, options, answer, hint, points, difficulty } = req.body;
    
    const challenge = new Challenge({
      challengeId,
      type,
      question,
      options,
      answer,
      hint: hint || '',
      points: points || 50,
      difficulty: difficulty || 'medium'
    });

    await challenge.save();
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update location
router.put('/locations/:locationId', async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { locationId: req.params.locationId },
      req.body,
      { new: true }
    );
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete location
router.delete('/locations/:locationId', async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({ locationId: req.params.locationId });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

