const express = require('express');

const paymentRouter = express.Router();

const {
    makePayment,
    getMyPayments,
    getPaymentById,
    getTutorPayments
} = require('../controllers/paymentController');

const {
    isAuthenticated,
    allowRoles
} = require('../middlewares/auth');

paymentRouter.use(isAuthenticated);

// student
paymentRouter.post(
    '/:bookingId/pay',
    allowRoles(['student']),
    makePayment
);

paymentRouter.get(
    '/',
    allowRoles(['student']),
    getMyPayments
);

// tutor earnings
paymentRouter.get(
    '/tutor/earnings',
    allowRoles(['tutor']),
    getTutorPayments
);

// shared
paymentRouter.get(
    '/:id',
    allowRoles(['student', 'tutor', 'admin']),
    getPaymentById
);

module.exports = paymentRouter;