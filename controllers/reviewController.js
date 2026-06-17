const Review = require('../models/Review');
const Course = require('../models/Course');

// CREATE REVIEW
const createReview = async (req, res) => {
    try {

        const { courseId, rating, comment } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        const existingReview = await Review.findOne({
            student: req.user._id,
            course: courseId
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'You have already reviewed this course'
            });
        }

        const review = await Review.create({
            student: req.user._id,
            tutor: course.tutor,
            course: courseId,
            rating,
            comment
        });

        res.status(201).json({
            message: 'Review added successfully',
            review
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET REVIEWS BY COURSE
const getReviewsByCourse = async (req, res) => {
    try {

        const reviews = await Review.find({
            course: req.params.courseId
        })
            .populate('student', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET REVIEWS BY TUTOR
const getReviewsByTutor = async (req, res) => {
    try {

        const reviews = await Review.find({
            tutor: req.params.tutorId
        })
            .populate('student', 'name')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        if (review.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Review deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createReview,
    getReviewsByCourse,
    getReviewsByTutor,
    deleteReview
};