const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// middleware to parse the body of incoming requests as JSON
app.use(express.json());

// middleware to parse cookies
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

module.exports = app;