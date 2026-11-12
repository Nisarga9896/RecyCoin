import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const MAX_IMAGES = 4;

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .filter((src) => typeof src === 'string' && src.trim())
    .map((src) => src.trim())
    .slice(0, MAX_IMAGES);
}

router.get('/', async (req, res, next) => {
  try {
    const { q, category, condition, sort, minPrice, maxPrice, status = 'available' } = req.query;
    const filter = {};

    if (status === 'all') {
      // show everything except hidden unless requested
      if (req.query.includeHidden !== 'true') filter.status = { $ne: 'hidden' };
    } else {
      filter.status = status;
    }

    if (category && category !== 'all') filter.category = category;
    if (condition && condition !== 'all') filter.condition = condition;
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: re }, { description: re }, { category: re }];
    }
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

    const sortOpts = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      name: { name: 1 },
    };
    const sortBy = sortOpts[sort] || sortOpts.newest;

    const items = await Item.find(filter).sort(sortBy).populate('seller', 'name avatarColor email');
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller', 'name avatarColor email');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { name, description, category, condition, price, emoji, images, age, defects } = req.body;
    if (!name || !description || !category || price === undefined)
      return res.status(400).json({ error: 'Name, description, category and price are required' });

    const normalizedImages = normalizeImages(images);
    if (!normalizedImages.length)
      return res.status(400).json({ error: 'At least one product image is required' });

    const item = await Item.create({
      name,
      description,
      category,
      condition: condition || 'Good',
      price: Number(price),
      emoji: emoji || '📦',
      images: normalizedImages,
      age: age ? String(age).trim() : '',
      defects: defects ? String(defects).trim() : '',
      seller: req.user._id,
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', protect, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'You can only edit your own items' });

    const allowed = ['name', 'description', 'category', 'condition', 'price', 'emoji', 'status', 'age', 'defects'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    }
    if (req.body.images !== undefined) {
      const normalizedImages = normalizeImages(req.body.images);
      if (!normalizedImages.length)
        return res.status(400).json({ error: 'At least one product image is required' });
      item.images = normalizedImages;
    }
    await item.save();
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'You can only delete your own items' });
    await item.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;