const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const errorRoute = require('./middlewares/errorRoute');
const logger = require('./middlewares/logger');
const courseRouter = require('./routes/courseRoutes');
const bookingRouter = require('./routes/Booking');
const paymentRouter = require('./routes/paymentRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// middleware to parse the body of incoming requests as JSON
app.use(express.json());

// middleware to parse cookies
app.use(cookieParser());

//custom logger middleware
app.use(logger);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/reviews', reviewRouter);

// middleware to handle 404 errors for undefined routes
app.use(errorRoute);

module.exports = app;