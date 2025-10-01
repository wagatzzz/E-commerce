const axios = require("axios");

let cachedToken = null;
let tokenExpiry = null;

exports.getPesapalToken = async (req, res, next) => {
  try {
    if (cachedToken && tokenExpiry > Date.now()) {
      return cachedToken;
    }

    const response = await axios.post(
      "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    cachedToken = response.data.token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000; // cache expiry

    return cachedToken;
  } catch (error) {
    console.error("Pesapal Auth Error:", error.message);
    throw new Error("Failed to fetch Pesapal token");
  }
};
