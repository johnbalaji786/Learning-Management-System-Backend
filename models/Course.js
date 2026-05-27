const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },

    thumbnail: {
        type: String,
        default: ''
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);