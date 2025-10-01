const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { getPesapalToken } = require("../utils/pesapalAuthHelper");

// Transaction status check
exports.getTransactionStatus = asyncHandler(async (req, res) => {
  const token = await getPesapalToken();
  const { orderTrackingId } = req.params;

  const response = await axios.get(
    `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const payment = await Payment.findOneAndUpdate(
    { pesapal_order_id: orderTrackingId },
    { status: response.data.payment_status_description },
    { new: true }
  );

  if (payment?.order) {
    const order = await Order.findById(payment.order);
    if (response.data.payment_status_description === "Completed") {
      order.status = "paid";
      await order.save();
    }
  }

  res.json(response.data);
});

// IPN listener
exports.ipnListener = asyncHandler(async (req, res) => {
  const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } =
    req.method === "POST" ? req.body : req.query;

  if (!OrderTrackingId) {
    res.status(400);
    throw new Error("Missing OrderTrackingId");
  }

  const token = await getPesapalToken();

  const response = await axios.get(
    `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const transactionData = response.data;

  const payment = await Payment.findOneAndUpdate(
    { pesapal_order_id: OrderTrackingId },
    { status: transactionData.payment_status_description },
    { new: true }
  );

  if (payment?.order) {
    const order = await Order.findById(payment.order);
    if (transactionData.payment_status_description === "Completed") {
      order.status = "paid";
    } else if (transactionData.payment_status_description === "Failed") {
      order.status = "cancelled";
    }
    await order.save();
  }

  res.json({
    orderNotificationType: OrderNotificationType,
    orderTrackingId: OrderTrackingId,
    orderMerchantReference: OrderMerchantReference,
    status: 200,
  });
});
