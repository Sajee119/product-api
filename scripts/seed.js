require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Beauty & Personal Care',
  'Automotive',
  'Health & Wellness',
  'Food & Grocery',
];

const adjectives = [
  'Premium', 'Ultra', 'Pro', 'Elite', 'Classic', 'Deluxe', 'Advanced',
  'Smart', 'Portable', 'Wireless', 'Digital', 'Ergonomic', 'Compact',
  'Heavy-Duty', 'Lightweight', 'Eco-Friendly', 'Stainless', 'Waterproof',
];

const nouns = [
  'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Speaker', 'Camera',
  'Laptop Stand', 'USB Hub', 'Cable', 'Charger', 'Backpack', 'Jacket',
  'Sneakers', 'Watch', 'Sunglasses', 'Blender', 'Coffee Maker', 'Toaster',
  'Air Fryer', 'Instant Pot', 'Yoga Mat', 'Dumbbell', 'Water Bottle',
  'Tent', 'Sleeping Bag', 'Novel', 'Cookbook', 'Puzzle', 'Board Game',
  'Action Figure', 'Serum', 'Shampoo', 'Moisturizer', 'Perfume',
  'Car Mount', 'Seat Cover', 'Vitamins', 'Protein Bar', 'Granola',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateProduct(index) {
  const adj = adjectives[randomInt(0, adjectives.length - 1)];
  const noun = nouns[randomInt(0, nouns.length - 1)];
  const category = categories[randomInt(0, categories.length - 1)];
  const price = randomFloat(1.99, 999.99);
  const stock = randomInt(0, 500);

  return {
    name: `${adj} ${noun} ${index}`,
    description: `High quality ${adj.toLowerCase()} ${noun.toLowerCase()} - product #${index}. Perfect for everyday use.`,
    price,
    category,
    stock,
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    const TOTAL = 10000;
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const batch = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL); j++) {
        batch.push(generateProduct(j + 1));
      }
      await Product.insertMany(batch);
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted}/${TOTAL} products`);
    }

    console.log(`\nSeed complete: ${inserted} products inserted`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
