import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const TRACKING_FLOW = [
  { label: 'Order placed', detail: 'Your order is being reviewed.' },
  { label: 'Packed', detail: 'Item is packed and ready for dispatch.' },
  { label: 'Shipped', detail: 'Package is on its way to you.' },
  { label: 'Delivered', detail: 'Delivered successfully. Thank you!' },
];

router.post('/', protect, async (req, res, next) => {
  try {
    const { itemId, discountPoints = 0 } = req.body;
    const item = await Item.findById(itemId).populate('seller');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.status !== 'available') return res.status(409).json({ error: 'This item is no longer available' });
    if (item.seller._id.toString() === req.user._id.toString())
      return res.status(400).json({ error: 'You cannot buy your own item' });

    const discount = Math.min(
      Math.floor(Number(discountPoints) || 0),
      req.user.points,
      Math.floor(item.price * 0.5)
    );
    const finalPrice = Math.max(0, item.price - discount);

    item.status = 'sold';
    await item.save();

    req.user.points -= discount;
    req.user.totalSpent += discount;
    await req.user.save();

    const seller = item.seller;
    seller.points += Math.floor(item.price * 0.05);
    await seller.save();

    const order = await Order.create({
      buyer: req.user._id,
      seller: item.seller._id,
      item: item._id,
      itemName: item.name,
      itemEmoji: item.emoji,
      itemImage: item.images?.[0] || '',
      itemCategory: item.category,
      price: item.price,
      discountPoints: discount,
      finalPrice,
      status: 'placed',
      tracking: [
        {
          label: TRACKING_FLOW[0].label,
          detail: TRACKING_FLOW[0].detail,
          at: new Date(),
        },
      ],
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email avatarColor');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('seller', 'name email avatarColor')
      .populate('buyer', 'name email avatarColor');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString()
    )
      return res.status(403).json({ error: 'Not your order' });
    res.json({ order, flow: TRACKING_FLOW });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Only the seller can update order status' });

    const nextStatus = req.body.status;
    if (!['placed', 'packed', 'shipped', 'delivered', 'cancelled'].includes(nextStatus))
      return res.status(400).json({ error: 'Invalid status' });

    if (nextStatus === 'cancelled') {
      if (order.status === 'delivered') return res.status(400).json({ error: 'Delivered orders cannot be cancelled' });
      order.status = 'cancelled';
      const item = await Item.findById(order.item);
      if (item) {
        item.status = 'available';
        await item.save();
      }
      const buyer = await User.findById(order.buyer);
      if (buyer) {
        buyer.points += order.discountPoints;
        await buyer.save();
      }
      const seller = await User.findById(order.seller);
      if (seller) {
        seller.points = Math.max(0, seller.points - Math.floor(order.price * 0.05));
        await seller.save();
      }
      order.tracking.push({ label: 'Cancelled', detail: 'Order was cancelled and points refunded.', at: new Date() });
    } else {
      const idx = TRACKING_FLOW.findIndex((t) => t.label.toLowerCase().includes(nextStatus));
      if (idx < 0) return res.status(400).json({ error: 'Invalid status' });
      order.status = nextStatus;
      order.tracking.push({ label: TRACKING_FLOW[idx].label, detail: TRACKING_FLOW[idx].detail, at: new Date() });
    }
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;