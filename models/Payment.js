const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['razorpay', 'stripe', 'paypal'],
        default: 'razorpay'
    },

    transactionId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },

    paidAt: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);