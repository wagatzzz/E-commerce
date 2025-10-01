const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  externalId: Number,
  title: { type: String, required: true },
  price: Number,
  description: String,
  category: String,
  image: String,
  inventory: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
