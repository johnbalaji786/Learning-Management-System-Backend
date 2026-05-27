const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['student', 'tutor', 'admin'],
        default: 'student'
    },

    profilePicture: {
        type: String,
        default: ''
    },

    phone: {
        type: String
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

    location: {
        type: String,
        default: ''
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);