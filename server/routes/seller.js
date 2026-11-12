import express from 'express';
import Item from '../models/Item.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', async (req, res, next) => {
  try {
    const items = await Item.find({ seller: req.user._id });
    const orders = await Order.find({ seller: req.user._id });

    const available = items.filter((i) => i.status === 'available').length;
    const sold = items.filter((i) => i.status === 'sold').length;

    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.finalPrice, 0);
    const pending = orders.filter((o) => ['placed', 'packed', 'shipped'].includes(o.status)).length;

    res.json({
      stats: {
        listed: items.length,
        available,
        sold,
        revenue,
        orders: orders.length,
        pending,
        totalViews: items.reduce((s, i) => s + (i.views || 0), 0),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/items', async (req, res, next) => {
  try {
    const items = await Item.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email avatarColor');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

export default router;