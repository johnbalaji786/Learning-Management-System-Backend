const Booking = require("../models/Booking");
const Course = require("../models/Course");

// ==============================
// CREATE BOOKING (Student)
// ==============================
const createBooking = async (req, res) => {
  try {
    const { courseId } = req.params;

    const studentId = req.user._id;

    const { bookingDate, startTime, endTime } = req.body;

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Prevent booking own course
    if (course.tutor.toString() === studentId.toString()) {
      return res.status(400).json({
        message: "You cannot book your own course",
      });
    }

    // Prevent duplicate booking
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

    // Only owner tutor
    if (booking.tutor.toString() !== tutorId) {
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

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.lessonRecording = recording;

    await booking.save();

    res.json({
      message: "Recording added successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
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
};
