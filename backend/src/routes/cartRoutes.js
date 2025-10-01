const express = require('express');
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// all routes require login
router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

module.exports = router;
