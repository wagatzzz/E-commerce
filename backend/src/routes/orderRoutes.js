const express = require('express');
const { createOrder, getOrdersForUser, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrdersForUser);
router.get('/:id', protect, getOrderById);

module.exports = router;
