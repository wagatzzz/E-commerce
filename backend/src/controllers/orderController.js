const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }

  const populatedItems = await Promise.all(items.map(async it => {
    const p = await Product.findById(it.product);
    if (!p) throw new Error(`Product ${it.product} not found`);
    return { product: p._id, qty: it.qty, price: p.price };
  }));

  const total = populatedItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const order = await Order.create({ user: req.user._id, items: populatedItems, total });
  res.status(201).json(order);
});

exports.getOrdersForUser = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Forbidden');
  }
  res.json(order);
});
