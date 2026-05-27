const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');


const isAuthenticated = async (req, res, next) => {
    // check if the token exists in the cookies
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // if no token, return unauthorized

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // verify the token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // if the token is valid, attach the decoded user information to the request object
        req.user = decoded;

       // call the next middleware or route handler
       next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

   
}

const allowRoles = (roles) => {
    return async (req, res, next) => {
        // get the userId from the request object
        const userId = req.userId;

        // get the user's role from the database
        const user = await User.findById(userId).select('-password');

        // check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if the user's role is in the allowed roles
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // add the user object to the request object
        req.user = user;

        // call the next middleware or route handler
        next();
    }
}

module.exports = {
    isAuthenticated,
    allowRoles
};