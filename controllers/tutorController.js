const Course = require("../models/Course");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

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

module.exports = {
  getTutorDashboard,
};
