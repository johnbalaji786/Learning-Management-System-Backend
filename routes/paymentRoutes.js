const express = require("express");

const router = express.Router();

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const {
  createOrder,
  makePayment,
  getMyPayments,
  getPaymentById,
  getTutorPayments,
} = require("../controllers/paymentController");

// Razorpay Order
router.post(
  "/create-order",
  isAuthenticated,
  allowRoles(["student"]),
  createOrder,
);

// Fake Payment
router.post(
  "/:bookingId/pay",
  isAuthenticated,
  allowRoles(["student"]),
  makePayment,
);

// Student Payment History
router.get(
  "/my-payments",
  isAuthenticated,
  allowRoles(["student"]),
  getMyPayments,
);

// Tutor Earnings
router.get(
  "/tutor-payments",
  isAuthenticated,
  allowRoles(["tutor"]),
  getTutorPayments,
);

// Single Payment
router.get("/:id", isAuthenticated, getPaymentById);

module.exports = router;
