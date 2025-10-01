const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { getPesapalToken } = require("../utils/pesapalAuthHelper");

const CALLBACK_URL =
  process.env.CALLBACK_URL || "http://localhost:5000/api/payment/callback";
const CANCEL_URL =
  process.env.CANCEL_URL || "http://localhost:5000/api/payment/cancel";
const NOTIFICATION_ID = process.env.PESAPAL_IPN_ID;

exports.checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // Calculate total
  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // 1️⃣ Create Order
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    totalAmount,
    status: "pending",
  });

  const token = await getPesapalToken();
  const orderRef = `order_${Date.now()}`;

  const body = {
    id: orderRef,
    currency: "KES",
    amount: totalAmount,
    description: "E-commerce checkout",
    callback_url: CALLBACK_URL,
    cancellation_url: CANCEL_URL,
    notification_id: NOTIFICATION_ID,
    billing_address: {
      email_address: req.user.email,
      first_name: req.user.name,
      phone_number: req.user.phone || "0700000000",
      country_code: "KE",
    },
  };

  const response = await axios.post(
    "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
    body,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // 2️⃣ Save Payment linked to Order
  const payment = await Payment.create({
    user: req.user._id,
    order: order._id,
    pesapal_order_id: response.data.order_tracking_id,
    amount: totalAmount,
    status: "pending",
  });

  // Link payment back to Order
  order.payment = payment._id;
  await order.save();

  // 3️⃣ Clear cart
  cart.items = [];
  await cart.save();

  res.status(200).json({
    redirect_url: response.data.redirect_url,
    order_tracking_id: response.data.order_tracking_id,
    order,
    payment,
  });
});
