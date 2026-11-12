import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { BINS, GAME_ITEMS } from '../data/gameData.js';

const router = express.Router();

// Public: static game configuration + item list
router.get('/config', (req, res) => {
  res.json({ bins: BINS, items: GAME_ITEMS });
});

// Public: global leaderboard of top recyclers by lifetime earnings
router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await User.find()
      .sort({ totalEarned: -1, points: -1 })
      .limit(10)
      .select('name avatarColor totalEarned points roundsPlayed createdAt');
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
});

// Auth: submit a finished round, updating points server-side from the payload.
// payload: { score (points gained this round), roundsPlayed: 1 }
router.post('/result', protect, async (req, res, next) => {
  try {
    const { score = 0 } = req.body;
    const delta = Math.round(Number(score)) || 0;

    req.user.points = Math.max(0, req.user.points + delta);
    req.user.totalEarned += Math.max(0, delta);
    req.user.roundsPlayed += 1;
    req.user.bestScore = Math.max(req.user.bestScore, Math.abs(delta));
    await req.user.save();

    res.json({ user: req.user.toSafe() });
  } catch (err) {
    next(err);
  }
});

export default router;