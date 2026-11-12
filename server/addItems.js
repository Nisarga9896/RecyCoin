import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './db.js';
import User from './models/User.js';
import Item from './models/Item.js';
import { DEMO_ITEMS } from './data/demoItems.js';

dotenv.config();

async function run() {
  await connectDB();

  let seller = await User.findOne({ email: 'bob@recycoin.com' });
  if (!seller) seller = await User.findOne({ isSeller: true });
  if (!seller) seller = await User.findOne();

  if (!seller) {
    throw new Error('No users found. Run "npm run seed" first so items can be assigned to a seller.');
  }

  const existing = await Item.find({}, 'name images age defects').lean();
  const existingByName = new Map(existing.map((item) => [item.name, item]));

  const newItems = [];
  let updated = 0;

  for (const item of DEMO_ITEMS) {
    const current = existingByName.get(item.name);
    if (!current) {
      newItems.push({ ...item, seller: seller._id, status: 'available' });
      continue;
    }
    const patch = {};
    const hasPlaceholderImage =
      !current.images?.length || current.images.every((src) => String(src).endsWith('.svg'));
    if (hasPlaceholderImage) patch.images = item.images;
    if (!current.age) patch.age = item.age;
    if (!current.defects) patch.defects = item.defects;
    if (Object.keys(patch).length) {
      await Item.updateOne({ _id: current._id }, { $set: patch });
      updated += 1;
    }
  }

  if (newItems.length) {
    await Item.insertMany(newItems);
    console.log(`Added ${newItems.length} marketplace items for seller ${seller.name}.`);
  }
  if (updated) {
    console.log(`Updated images/details for ${updated} existing demo items.`);
  }
  if (!newItems.length && !updated) {
    console.log(`Marketplace already has all ${DEMO_ITEMS.length} demo items.`);
  }

  const total = await Item.countDocuments();
  console.log(`Total marketplace items in MongoDB: ${total}`);
  await disconnectDB();
}

run().catch((err) => {
  console.error('Failed to add marketplace items:', err.message);
  process.exit(1);
});
