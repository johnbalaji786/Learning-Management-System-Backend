const Course = require("../models/Course");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const TutorProfile = require("../models/TutorProfile");

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
    const tutorId = req.user._id;

    const profile = await TutorProfile.findOne({
      user: tutorId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    res.status(200).json({
      availability: profile.availability || [],
    });
  } catch (error) {
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
    const tutorId = req.user._id;

    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        message: "Availability must be an array",
      });
    }

    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const slot of availability) {
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return res.status(400).json({
          message: "Day, start time and end time are required",
        });
      }

      if (!validDays.includes(slot.day.toLowerCase())) {
        return res.status(400).json({
          message: `Invalid day: ${slot.day}`,
        });
      }

      const start = new Date(`1970-01-01T${slot.startTime}:00`);

      const end = new Date(`1970-01-01T${slot.endTime}:00`);

      if (start >= end) {
        return res.status(400).json({
          message: `Start time must be earlier than end time for ${slot.day}`,
        });
      }
    }

    const profile = await TutorProfile.findOneAndUpdate(
      { user: tutorId },
      {
        availability,
      },
      {
        new: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    res.status(200).json({
      message: "Availability updated successfully",
      availability: profile.availability,
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
