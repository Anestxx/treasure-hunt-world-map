const express = require('express');
const Location = require('../models/Location');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all locations (with user's completion status)
router.get('/', async (req, res) => {
  try {
    let userProgress = null;

    // If user is logged in, attach progress (but don't require it)
    if (req.user) {
      userProgress = await Progress.findOne({ userId: req.user.id });
    }

    const locations = await Location.find().lean();

    const enriched = locations.map(loc => {
      const completed = userProgress?.locationsCompleted?.includes(loc.locationId) || false;
      const locked = loc.order > (userProgress?.locationsCompleted?.length || 0) + 1;

      return { ...loc, completed, locked };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching locations' });
  }
});


// Get single location
router.get('/:locationId', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ locationId: req.params.locationId })
      .populate('challengeId');
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const userCompletedIds = req.user.locationsCompleted.map(id => id.toString());
    
    res.json({
      ...location.toObject(),
      completed: userCompletedIds.includes(location._id.toString()),
      locked: location.locked || (location.unlockRequirement > 0 && req.user.locationsCompleted.length < location.unlockRequirement)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

