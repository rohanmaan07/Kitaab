const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Models/payment"); // Assuming you have a Payment model defined
require("dotenv").config();

// Check if Razorpay keys are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
    console.error("Razorpay key ID or secret is not set in the environment variables.");
    process.exit(1);
}

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ROUTE 1: Create Order API 
router.post("/order", async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
    }

    try {
        const options = {
            amount: Number(amount) * 100,  // Convert amount to paise
            currency: "INR",
            receipt: `receipt#${crypto.randomBytes(10).toString("hex")}`, // More descriptive receipt
        };

        // Create the order asynchronously
        const order = await razorpayInstance.orders.create(options);
        console.log("Order created successfully:", order);
        res.status(200).json({ data: order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create order." });
    }
});

// ROUTE 2: Verify Payment Signature
router.post("/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "All payment details are required" });
    }

    try {
        // Generate expected signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign === razorpay_signature) {
            // Save the payment details to the database if signatures match
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            await payment.save();

            return res.json({ message: "Payment Successfully Verified" });
        } else {
            // If signatures don't match
            return res.status(400).json({ message: "Invalid Payment Signature" });
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        res.status(500).json({ message: "Failed to verify payment." });
    }
});

module.exports = router;
