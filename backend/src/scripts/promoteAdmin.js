require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();
  const email = process.argv[2];
  if (!email) throw new Error('node src/scripts/promoteAdmin.js email@example.com');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  user.role = 'admin';
  await user.save();
  console.log('Promoted to admin:', user.email);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
