const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('locationsCompleted', 'name locationId country badge');
    
    res.json({
      points: user.points,
      badges: user.badges,
      locationsCompleted: user.locationsCompleted,
      totalLocations: await require('../models/Location').countDocuments(),
      completionPercentage: Math.round((user.locationsCompleted.length / await require('../models/Location').countDocuments()) * 100) || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

