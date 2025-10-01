require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const axios = require('axios');

const run = async () => {
  await connectDB();
  const { data } = await axios.get('https://fakestoreapi.com/products');
  await Product.deleteMany({});
  const docs = data.map(p => ({
    externalId: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.image,
    inventory: Math.floor(Math.random() * 50) + 1,
  }));
  await Product.insertMany(docs);
  console.log('Seeded', docs.length, 'products');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
