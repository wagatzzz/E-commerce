const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

exports.getProducts = asyncHandler(async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;

  const skip = (page - 1) * Number(limit);
  const products = await Product.find(filter).skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(filter);
  res.json({ products, total });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.remove();
  res.json({ message: 'Product removed' });
});
