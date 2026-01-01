// routes/paymentRoutes.js
const Payment = require("../models/payment");

exports.amountPay = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Mock Payment (you can later integrate Razorpay/Stripe)
    payment.status = "paid";
    payment.transactionId = "MOCKTXN-" + Date.now();
    payment.paidAt = new Date();

    await payment.save();

    res.json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ message: "Error making payment" });
  }
};
