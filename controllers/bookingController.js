const Booking = require('../models/Booking');
const Course = require('../models/Course');

// CREATE BOOKING
const createBooking = async (req, res) => {
try {

   
    const { courseId } = req.params;
    // const studentId = req.user.userId;
    const studentId = req.user._id;

    const {
        bookingDate,
        startTime,
        endTime
    } = req.body;

    // check course exists
    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).json({
            message: 'Course not found'
        });
    }

    // check duplicate booking
    const existingBooking = await Booking.findOne({
        course: courseId,
        student: studentId
    });

    if (existingBooking) {
        return res.status(400).json({
            message: 'You have already booked this course'
        });
    }

    const booking = new Booking({
        student: studentId,
        tutor: course.tutor,
        course: courseId,
        bookingDate,
        startTime,
        endTime,
        amount: course.price
    });

    await booking.save();

    res.status(201).json({
        message: 'Booking created successfully',
        booking
    });

} catch (error) {

    res.status(500).json({
        message: error.message
    });

}


};

// GET MY BOOKINGS (STUDENT)
const getMyBookings = async (req, res) => {
try {


    const studentId = req.user._id;

    const bookings = await Booking.find({
        student: studentId
    })
        .populate('course')
        .populate('tutor', 'name email');

    res.status(200).json({
        bookings
    });

} catch (error) {

    res.status(500).json({
        message: error.message
    });

}


};

// UPDATE BOOKING STATUS (TUTOR)
const updateBookingStatus = async (req, res) => {
try {


    const { bookingId } = req.params;
    const { status, meetingLink } = req.body;

    const tutorId = req.user.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({
            message: 'Booking not found'
        });
    }

    // only tutor can update
    if (booking.tutor.toString() !== tutorId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }

    booking.status = status;

    if (meetingLink) {
        booking.meetingLink = meetingLink;
    }

    await booking.save();

    res.status(200).json({
        message: 'Booking updated successfully',
        booking
    });

} catch (error) {

    res.status(500).json({
        message: error.message
    });

}


};

// GET BOOKING BY ID
const getBookingById = async (req, res) => {
try {


    const { id } = req.params;

    const booking = await Booking.findById(id)
        .populate('student', 'name email')
        .populate('tutor', 'name email')
        .populate('course');

    if (!booking) {
        return res.status(404).json({
            message: 'Booking not found'
        });
    }

    res.status(200).json({
        booking
    });

} catch (error) {

    res.status(500).json({
        message: error.message
    });

}


};

module.exports = {
createBooking,
getMyBookings,
updateBookingStatus,
getBookingById
};
