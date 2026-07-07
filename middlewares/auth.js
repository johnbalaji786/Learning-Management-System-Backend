const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  // check if token exists
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // attach decoded user data
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

const allowRoles = (roles) => {
  return async (req, res, next) => {
    try {
      // get userId from token
      const userId = req.user.userId;

      // find user
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // check role
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // attach user
      req.user = user;

      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
};

module.exports = {
  isAuthenticated,
  allowRoles,
};
