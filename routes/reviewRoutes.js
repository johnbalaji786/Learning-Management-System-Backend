const express = require('express');

const reviewRouter = express.Router();

const {
    createReview,
    getReviewsByCourse,
    getReviewsByTutor,
    deleteReview
} = require('../controllers/reviewController');

const {
    isAuthenticated,
    allowRoles
} = require('../middlewares/auth');

// CREATE REVIEW
reviewRouter.post(
    '/',
    isAuthenticated,
    allowRoles(['student']),
    createReview
);

// GET COURSE REVIEWS
reviewRouter.get(
    '/course/:courseId',
    getReviewsByCourse
);

// GET TUTOR REVIEWS
reviewRouter.get(
    '/tutor/:tutorId',
    getReviewsByTutor
);

// DELETE REVIEW
reviewRouter.delete(
    '/:id',
    isAuthenticated,
    allowRoles(['student']),
    deleteReview
);

module.exports = reviewRouter;