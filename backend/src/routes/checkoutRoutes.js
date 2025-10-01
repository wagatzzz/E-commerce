const express = require("express");
const { checkout } = require("../controllers/checkoutController.js");
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", protect, checkout);

module.exports = router;
