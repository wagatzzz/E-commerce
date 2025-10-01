const express = require("express");
const { getTransactionStatus, ipnListener } = require("../controllers/paymentController.js");

const router = express.Router();

router.get("/transaction-status/:orderTrackingId", getTransactionStatus);
router.all("/ipn-listener", ipnListener);

module.exports = router;
