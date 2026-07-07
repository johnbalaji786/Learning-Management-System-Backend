const express = require("express");

const router = express.Router();

const {
  createReview,
  getReviewsByCourse,
  getReviewsByTutor,
  deleteReview,
} = require("../controllers/reviewController");

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

// ==============================
// PUBLIC ROUTES
// ==============================

// Get Reviews By Course
router.get("/course/:courseId", getReviewsByCourse);

// Get Reviews By Tutor
router.get("/tutor/:tutorId", getReviewsByTutor);

// ==============================
// PROTECTED ROUTES
// ==============================

// Student Review
router.post(
  "/:courseId",
  isAuthenticated,
  allowRoles(["student"]),
  createReview,
);

// Delete Review
router.delete("/:id", isAuthenticated, allowRoles(["student"]), deleteReview);

module.exports = router;
