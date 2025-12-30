const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find()
      .select('username points badges locationsCompleted')
      .sort({ points: -1 })
      .limit(limit);
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      points: user.points,
      badgesCount: user.badges.length,
      locationsCount: user.locationsCompleted.length
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's rank
router.get('/my-rank', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const usersWithMorePoints = await User.countDocuments({
      points: { $gt: user.points }
    });

    const rank = usersWithMorePoints + 1;
    const totalUsers = await User.countDocuments();

    res.json({
      rank,
      totalUsers,
      points: user.points
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

