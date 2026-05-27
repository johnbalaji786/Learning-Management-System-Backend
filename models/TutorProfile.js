const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    bio: {
        type: String,
        default: ''
    },

    subjects: [{
        type: String
    }],

    experience: {
        type: Number,
        default: 0
    },

    hourlyRate: {
        type: Number,
        default: 0
    },

    qualifications: [{
        type: String
    }],

    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],

    averageRating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);