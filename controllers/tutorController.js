const Course = require("../models/Course");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const User = require("../models/user");

const getTutorDashboard = async (req, res) => {
  try {
    const tutorId = req.user._id;
    console.log("Logged in Tutor:", tutorId);

    const totalCourses = await Course.countDocuments({
      tutor: tutorId,
    });

    console.log("Total Courses:", totalCourses);
    const totalBookings = await Booking.countDocuments({
      tutor: tutorId,
    });

    const completedLessons = await Booking.countDocuments({
      tutor: tutorId,
      status: "completed",
    });

    const pendingBookings = await Booking.countDocuments({
      tutor: tutorId,
      status: "pending",
    });

    // Total Earnings
    const paidBookings = await Booking.find({
      tutor: tutorId,
      paymentStatus: "paid",
    });

    const totalEarnings = paidBookings.reduce(
      (sum, booking) => sum + booking.amount,
      0,
    );

    // Total Reviews
    const totalReviews = await Review.countDocuments({
      tutor: tutorId,
    });

    // Recent Bookings
    const recentBookings = await Booking.find({
      tutor: tutorId,
    })
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCourses,
      totalBookings,
      completedLessons,
      pendingBookings,
      totalEarnings,
      totalReviews,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// GET TUTOR AVAILABILITY
// ==============================
const getTutorAvailability = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.USER ID:", req.user?._id);

    const tutor = await User.findOne({
      _id: req.user._id,
      role: "tutor",
    }).select("availability");

    console.log("TUTOR:", tutor);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.status(200).json({
      availability: tutor.availability || [],
    });
  } catch (error) {
    console.error("GET AVAILABILITY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// UPDATE TUTOR AVAILABILITY
// ==============================
const updateTutorAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        message: "Availability must be an array",
      });
    }

    const tutor = await User.findOne({
      _id: req.user._id,
      role: "tutor",
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    tutor.availability = availability;

    await tutor.save();

    res.status(200).json({
      message: "Availability updated successfully",
      availability: tutor.availability,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTutorDashboard,
  getTutorAvailability,
  updateTutorAvailability,
};
