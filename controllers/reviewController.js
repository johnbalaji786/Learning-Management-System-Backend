const Review = require("../models/Review");
const Course = require("../models/Course");
const Booking = require("../models/Booking");

// ==============================
// CREATE REVIEW
// ==============================
const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const studentId = req.user._id;

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check booking completed
    // const booking = await Booking.findOne({
    //   student: studentId,
    //   course: courseId,
    //   status: "completed",
    // });
    const booking = await Booking.findOne({
      student: studentId,
      course: courseId,
    });

    if (!booking) {
      return res.status(400).json({
        message: "Complete the course before reviewing",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this course",
      });
    }

    const review = await Review.create({
      student: studentId,
      tutor: course.tutor,
      course: courseId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET REVIEWS BY COURSE
// ==============================
const getReviewsByCourse = async (req, res) => {
  try {
    const reviews = await Review.find({
      course: req.params.courseId,
    })
      .populate("student", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET REVIEWS BY TUTOR
// ==============================
const getReviewsByTutor = async (req, res) => {
  try {
    const reviews = await Review.find({
      tutor: req.params.tutorId,
    })
      .populate("student", "name profilePicture")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// DELETE REVIEW
// ==============================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReviewsByCourse,
  getReviewsByTutor,
  deleteReview,
};
