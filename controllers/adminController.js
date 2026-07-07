const User = require("../models/User");
const Course = require("../models/Course");
const Booking = require("../models/Booking");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalTutors = await User.countDocuments({
      role: "tutor",
    });

    const totalCourses = await Course.countDocuments();

    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalUsers,
      totalTutors,
      totalCourses,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
};
