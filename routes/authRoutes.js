const express = require('express');

const authRouter = express.Router();
const {register, login, getMe,Logout} = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// public routes for registration and login
authRouter.post('/register', register);
authRouter.post('/login', login);

// protected route to get the current user's information
authRouter.get('/getMe', isAuthenticated, getMe);
authRouter.post('/logout', isAuthenticated, Logout);

module.exports = authRouter;