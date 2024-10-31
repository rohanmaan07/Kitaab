const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Models/payment"); 
require("dotenv").config();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_1XTzzNAKB6IQ6n",
  key_secret: "pnZCdySzgRlYbcIPWfHr5Ean",
});

// ROUTE 1: Create Order API
router.post("/order", async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100), // Convert amount to paise
      currency: "INR",
    };
    const order = await razorpayInstance.orders.create(options);
    console.log("Order created successfully:", order);
    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// ROUTE 2: Verify Payment Signature
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "pnZCdySzgRlYbcIPWfHr5Ean") // Fix typo here
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      // Save payment details to the database
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      res.status(200).json({ success: true, message: "Payment verified successfully!" });
    } catch (error) {
      console.error("Error saving payment to database:", error);
      res.status(500).json({ message: "Error saving payment to database" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid signature, verification failed!" });
  }
});

module.exports = router;
