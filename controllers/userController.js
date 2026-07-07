const User = require("../models/user");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BLOCK / UNBLOCK USER
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      message: "User status updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// GET ALL TUTORS
const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.find({
      role: "tutor",
    }).select("-password");

    res.status(200).json({
      tutors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// GET STUDENT DASHBOARD
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalBookings = await Booking.countDocuments({
      student: userId,
    });

    const totalPayments = await Payment.countDocuments({
      student: userId,
      status: "success",
    });

    const totalReviews = await Review.countDocuments({
      student: userId,
    });

    res.status(200).json({
      totalBookings,
      totalPayments,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllTutors,
  getStudentDashboard,
};
