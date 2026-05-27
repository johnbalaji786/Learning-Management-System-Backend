const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

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

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    bookingDate: {
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    meetingLink: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    amount: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);