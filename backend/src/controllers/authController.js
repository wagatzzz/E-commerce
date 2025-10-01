const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password required'); }

  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('User already exists'); }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hash });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});
