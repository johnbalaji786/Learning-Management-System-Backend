const Booking = require("../models/Booking");
const Course = require("../models/Course");
const User = require("../models/user");

// ==============================
// CREATE BOOKING (Student)
// ==============================
const createBooking = async (req, res) => {
  try {
    const { courseId } = req.params;

    const studentId = req.user._id;

    const { bookingDate, startTime, endTime } = req.body;

    // ==============================
    // Validate required fields
    // ==============================
    if (!bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        message: "Please fill all booking details",
      });
    }

    // ==============================
    // Validate start time < end time
    // ==============================
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (start >= end) {
      return res.status(400).json({
        message: "Start time must be earlier than end time",
      });
    }

    // ==============================
    // Check course exists
    // ==============================
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // ==============================
    // Prevent booking own course
    // ==============================
    if (course.tutor.toString() === studentId.toString()) {
      return res.status(400).json({
        message: "You cannot book your own course",
      });
    }

    // ==============================
    // Check Tutor Availability
    // ==============================
    const tutor = await User.findOne({
      _id: course.tutor,
      role: "tutor",
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Get day from booking date
    const bookingDay = new Date(bookingDate)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    // Find matching availability
    const availableSlot = (tutor.availability || []).find(
      (slot) => slot.day.toLowerCase() === bookingDay,
    );
    if (!availableSlot) {
      return res.status(400).json({
        message: `Tutor is not available on ${bookingDay}`,
      });
    }

    // ==============================
    // Check booking time is inside
    // tutor availability
    // ==============================

    const requestedStart = new Date(`1970-01-01T${startTime}:00`);

    const requestedEnd = new Date(`1970-01-01T${endTime}:00`);

    const availableStart = new Date(`1970-01-01T${availableSlot.startTime}:00`);

    const availableEnd = new Date(`1970-01-01T${availableSlot.endTime}:00`);

    if (requestedStart < availableStart || requestedEnd > availableEnd) {
      return res.status(400).json({
        message: `Tutor is available on ${bookingDay} only from ${availableSlot.startTime} to ${availableSlot.endTime}`,
      });
    }

    // ==============================
    // Prevent duplicate booking
    // ==============================
    const existingBooking = await Booking.findOne({
      course: courseId,
      student: studentId,
      bookingDate,
      startTime,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already booked this slot",
      });
    }

    // ==============================
    // Create booking
    // ==============================
    const booking = await Booking.create({
      student: studentId,
      tutor: course.tutor,
      course: courseId,
      bookingDate,
      startTime,
      endTime,
      amount: course.price,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET MY BOOKINGS (Student)
// ==============================
const getMyBookings = async (req, res) => {
  try {
    const studentId = req.user._id;

    const bookings = await Booking.find({
      student: studentId,
    })
      .populate("course")
      .populate("tutor", "name email");

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// UPDATE BOOKING STATUS (Tutor)
// ==============================
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { status, meetingLink } = req.body;

    const tutorId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.tutor.toString() !== tutorId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const validStatus = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    booking.status = status;

    if (meetingLink) {
      booking.meetingLink = meetingLink;
    }

    await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET SINGLE BOOKING
// ==============================
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = req.user._id;

    const booking = await Booking.findById(id)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("course");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isStudent = booking.student._id.toString() === currentUser.toString();

    const isTutor = booking.tutor._id.toString() === currentUser.toString();

    if (!isStudent && !isTutor) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getTutorBookings = async (req, res) => {
  try {
    const tutorId = req.user._id;

    const bookings = await Booking.find({
      tutor: tutorId,
    })
      .populate("student", "name email")
      .populate("course");

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addMeetingLink = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { meetingLink } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.meetingLink = meetingLink;

    await booking.save();

    res.json({
      message: "Meeting link added successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addLessonRecording = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { recording } = req.body;

    const tutorId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only the tutor who owns this booking can add recording
    if (booking.tutor.toString() !== tutorId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to add recording",
      });
    }

    if (!recording) {
      return res.status(400).json({
        message: "Recording URL is required",
      });
    }

    booking.lessonRecording = recording;

    await booking.save();

    res.status(200).json({
      message: "Recording added successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// GET LESSON RECORDING
// Student: Only authorized student
// Tutor: Only booking owner tutor
// ==============================
const getLessonRecording = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const currentUserId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check whether current user is the student or tutor
    const isStudent = booking.student.toString() === currentUserId.toString();

    const isTutor = booking.tutor.toString() === currentUserId.toString();

    // Only related student or tutor can access
    if (!isStudent && !isTutor) {
      return res.status(403).json({
        message: "You are not authorized to access this recording",
      });
    }

    // Recording not uploaded yet
    if (!booking.lessonRecording) {
      return res.status(404).json({
        message: "Lesson recording not available",
      });
    }

    return res.status(200).json({
      message: "Recording access granted",
      recording: booking.lessonRecording,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// CANCEL BOOKING (Student)
// ==============================
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const studentId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only the student who created the booking can cancel it
    if (booking.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this booking",
      });
    }

    // Already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // Completed lesson cannot be cancelled
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// RESCHEDULE BOOKING (Student)
// ==============================
const rescheduleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const studentId = req.user._id;

    const { bookingDate, startTime, endTime } = req.body;

    if (!bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        message: "Booking date, start time and end time are required",
      });
    }

    // Validate time
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (start >= end) {
      return res.status(400).json({
        message: "Start time must be earlier than end time",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only booking owner can reschedule
    if (booking.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reschedule this booking",
      });
    }

    // Cancelled booking cannot be rescheduled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be rescheduled",
      });
    }

    // Completed booking cannot be rescheduled
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be rescheduled",
      });
    }

    // Check duplicate slot
    const existingBooking = await Booking.findOne({
      _id: { $ne: bookingId },
      tutor: booking.tutor,
      bookingDate,
      startTime,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    booking.bookingDate = bookingDate;
    booking.startTime = startTime;
    booking.endTime = endTime;

    // Rescheduled booking goes back to pending
    booking.status = "pending";

    await booking.save();

    return res.status(200).json({
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingById,
  getTutorBookings,
  addMeetingLink,
  addLessonRecording,
  cancelBooking,
  rescheduleBooking,
  getLessonRecording,
};
