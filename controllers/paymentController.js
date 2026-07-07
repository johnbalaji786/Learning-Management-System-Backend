const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = require("../utils/config");

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

// CREATE PAYMENT ORDER
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const options = {
      amount: booking.amount * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// FAKE PAYMENT
// ==============================
const makePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const existingPayment = await Payment.findOne({
      booking: bookingId,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already completed",
      });
    }

    const payment = await Payment.create({
      student: booking.student,
      tutor: booking.tutor,
      booking: booking._id,
      amount: booking.amount,
      paymentMethod: "razorpay",
      transactionId: `TXN_${Date.now()}`,
      status: "success",
      paidAt: new Date(),
    });

    booking.paymentStatus = "paid";
    await booking.save();

    res.status(200).json({
      message: "Payment Successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyPayments = async (req, res) => {
  res.json({ payments: [] });
};

const getPaymentById = async (req, res) => {
  res.json({ payment: {} });
};

const getTutorPayments = async (req, res) => {
  res.json({
    totalEarnings: 0,
    payments: [],
  });
};

module.exports = {
  createOrder,
  makePayment,
  getMyPayments,
  getPaymentById,
  getTutorPayments,
};
