const express = require("express");
const { getTransactionStatus, ipnListener } = require("../controllers/paymentController.js");

const router = express.Router();

router.get("/transaction-status/:orderTrackingId", getTransactionStatus);
router.all("/ipn-listener", ipnListener);

router.get("/callback", (req, res) => {
  res.send("Payment completed or pending. You can redirect user to dashboard.");
});

router.get("/cancel", (req, res) => {
  res.send("Payment was cancelled. Redirect user back to checkout page.");
});

module.exports = router;
