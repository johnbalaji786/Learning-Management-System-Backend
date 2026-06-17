const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// MAKE PAYMENT
const makePayment = async (req, res) => {
    try {

        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // check if already paid
        const existingPayment = await Payment.findOne({
            booking: bookingId,
            status: 'success'
        });

        if (existingPayment) {
            return res.status(400).json({
                message: 'Payment already completed'
            });
        }

        const payment = await Payment.create({
            student: booking.student,
            tutor: booking.tutor,
            booking: booking._id,
            amount: booking.amount,
            paymentMethod: 'razorpay',
            transactionId: `TXN_${Date.now()}`,
            status: 'success',
            paidAt: new Date()
        });

        // update booking payment status
        booking.paymentStatus = 'paid';

        await booking.save();

        res.status(201).json({
            message: 'Payment successful',
            payment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET MY PAYMENTS
const getMyPayments = async (req, res) => {
    try {

        const studentId = req.user._id;

        const payments = await Payment.find({
            student: studentId
        })
            .populate('booking')
            .populate('tutor', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            payments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET PAYMENT BY ID
const getPaymentById = async (req, res) => {
    try {

        const { id } = req.params;

        const payment = await Payment.findById(id)
            .populate('student', 'name email')
            .populate('tutor', 'name email')
            .populate('booking');

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            payment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET TUTOR EARNINGS
const getTutorPayments = async (req, res) => {
    try {

        const tutorId = req.user.userId;

        const payments = await Payment.find({
            tutor: tutorId,
            status: 'success'
        })
            .populate('student', 'name email')
            .populate('booking')
            .sort({ createdAt: -1 });

        const totalEarnings = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        res.status(200).json({
            totalEarnings,
            payments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    makePayment,
    getMyPayments,
    getPaymentById,
    getTutorPayments
};