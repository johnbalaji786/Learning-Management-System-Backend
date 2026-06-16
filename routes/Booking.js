const express = require('express');

const {
    isAuthenticated,
    allowRoles
} = require('../middlewares/auth');

const {
    createBooking,
    getMyBookings,
    updateBookingStatus,
    getBookingById
} = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.use(isAuthenticated);

// Student Routes
bookingRouter.post(
    '/:courseId/book',
    allowRoles(['student']),
    createBooking
);

bookingRouter.get(
    '/',
    allowRoles(['student']),
    getMyBookings
);

// Tutor Routes
bookingRouter.put(
    '/:bookingId/status',
    allowRoles(['tutor']),
    updateBookingStatus
);

// Shared Routes
bookingRouter.get(
    '/:id',
    allowRoles(['student', 'tutor']),
    getBookingById
);

module.exports = bookingRouter;