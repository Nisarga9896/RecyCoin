import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './db.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Order from './models/Order.js';
import { CATEGORIES } from './data/gameData.js';
import { DEMO_ITEMS } from './data/demoItems.js';

dotenv.config();

const reset = process.argv.includes('--reset');

async function run() {
  await connectDB();

  if (reset) {
    await Promise.all([User.deleteMany({}), Item.deleteMany({}), Order.deleteMany({})]);
    console.log('🗑️  Cleared existing data.');
  }

  const hash = await bcrypt.hash('Demo@123', 10);

  const alice = await User.create({
    name: 'Alice Green',
    email: 'demo@recycoin.com',
    password: hash,
    points: 250,
    totalEarned: 540,
    totalSpent: 290,
    roundsPlayed: 12,
    bestScore: 70,
    avatarColor: '#10b981',
    isSeller: false,
  });

  const bob = await User.create({
    name: 'Bob Recycler',
    email: 'bob@recycoin.com',
    password: hash,
    points: 120,
    totalEarned: 310,
    totalSpent: 120,
    roundsPlayed: 8,
    bestScore: 60,
    avatarColor: '#0ea5e9',
    isSeller: true,
  });

  let items = [];
  for (const d of DEMO_ITEMS) {
    const owner = d.price > 10000 ? bob : alice;
    items.push(
      await Item.create({
        ...d,
        seller: owner._id,
        status: 'available',
      })
    );
  }
  console.log(`✅ Seeded ${items.length} marketplace items.`);

  if (!reset && (await Order.countDocuments()) === 0) {
    const available = items.find((i) => i.status === 'available');
    if (available) {
      await Order.create({
        buyer: alice._id,
        seller: bob._id,
        item: available._id,
        itemName: available.name,
        itemEmoji: available.emoji,
        itemImage: available.images?.[0] || '',
        itemCategory: available.category,
        price: available.price,
        discountPoints: 0,
        finalPrice: available.price,
        status: 'delivered',
        tracking: [
          { label: 'Order placed', detail: 'Your order is being reviewed.', at: new Date(Date.now() - 7 * 864e5) },
          { label: 'Packed', detail: 'Item is packed.', at: new Date(Date.now() - 6 * 864e5) },
          { label: 'Shipped', detail: 'Package on the way.', at: new Date(Date.now() - 5 * 864e5) },
          { label: 'Delivered', detail: 'Delivered successfully!', at: new Date(Date.now() - 3 * 864e5) },
        ],
      });
      console.log('✅ Seeded a sample delivered order.');
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('   Demo login → demo@recycoin.com / Demo@123  (points: 250)');
  console.log('   Seller login → bob@recycoin.com / Demo@123');
  await disconnectDB();
}

run().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});