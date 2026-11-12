import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (!['buyer', 'seller'].includes(role))
      return res.status(400).json({ error: 'Account type must be buyer or seller' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
    const user = await User.create({
      name,
      email,
      password: hash,
      points: 50,
      isSeller: role === 'seller',
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    });

    res.status(201).json({ token: sign(user), user: user.toSafe() });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ token: sign(user), user: user.toSafe() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ user: user.toSafe() });
  } catch (err) {
    next(err);
  }
});

router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    const items = user.wishlist.filter(Boolean);
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post('/wishlist/:itemId', protect, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.findIndex((id) => id.toString() === itemId);
    if (idx >= 0) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(itemId);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
});

router.delete('/wishlist/:itemId', protect, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== itemId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
});

export default router;