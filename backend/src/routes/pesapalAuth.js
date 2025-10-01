const express = require("express");
const router = express.Router();
const { getPesapalToken } = require("../utils/pesapalAuthHelper");

router.post("/auth", async (req, res) => {
  try {
    const token = await getPesapalToken();
    res.json({ token, message: "Token fetched successfully" });
  } catch (error) {
    console.error("Pesapal Auth Error:", error.message);
    res.status(500).json({
      message: "Failed to get Pesapal token",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
