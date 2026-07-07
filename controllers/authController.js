const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../utils/config');

const authController = {

    register: async (req, res) => {

    try {
          
      //get the details from the request body
      const { name, email, password , role } = req.body;
      
       // check if the user exists already
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // encrypt the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user
            const newUser = new User({ name, email, password: hashedPassword , role });

            // save the user to the database
            await newUser.save();
       

            res.status(201).json({
                message: 'User registered successfully'
            });

        } catch (error) {

            console.log(error);

    res.status(500).json({
        message: error.message
    });
        }

    },

    login: async (req, res) => { 
        try {

            const { email, password } = req.body;

             // check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email does not exist' });
            }

            // check if the password is correct
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // generate a JWT token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            // set the token in the cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

             return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {

          res.status(500).json({
            message: error.message
          });
        }
    },

    getMe: async (req, res) => {
    try {

        const userId = req.user.userId;
  console.log(userId);
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
    },
    Logout: async (req, res) => {
        try {
            res.clearCookie('token', {
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
            });
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
   }



};

module.exports = authController;