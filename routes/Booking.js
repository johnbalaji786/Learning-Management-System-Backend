const express = require("express");

const bookingRouter = express.Router();

const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  getTutorBookings,
  addMeetingLink,
  addLessonRecording,
  cancelBooking,
  rescheduleBooking,
} = require("../controllers/bookingController");

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

bookingRouter.use(isAuthenticated);

// ==============================
// STUDENT ROUTES
// ==============================

bookingRouter.post("/:courseId/book", allowRoles(["student"]), createBooking);

bookingRouter.get("/my-bookings", allowRoles(["student"]), getMyBookings);

bookingRouter.put("/:bookingId/cancel", allowRoles(["student"]), cancelBooking);

bookingRouter.put(
  "/:bookingId/reschedule",
  allowRoles(["student"]),
  rescheduleBooking,
);

// ==============================
// TUTOR ROUTES
// ==============================

bookingRouter.get("/tutor-bookings", allowRoles(["tutor"]), getTutorBookings);

bookingRouter.put(
  "/:bookingId/status",
  allowRoles(["tutor"]),
  updateBookingStatus,
);

bookingRouter.put("/:bookingId/meeting", allowRoles(["tutor"]), addMeetingLink);

// ==============================
// SHARED ROUTES
// ==============================

bookingRouter.get("/:id", allowRoles(["student", "tutor"]), getBookingById);
// ==============================
// RECORDING ROUTES
// ==============================
bookingRouter.put(
  "/:bookingId/recording",
  allowRoles(["tutor"]),
  addLessonRecording,
);
module.exports = bookingRouter;
