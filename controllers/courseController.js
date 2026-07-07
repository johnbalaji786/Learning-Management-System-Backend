const Course = require("../models/Course");

const courseController = {
  // CREATE COURSE
  createCourse: async (req, res) => {
    try {
      console.log("CREATE COURSE HIT");
      console.log(req.user);
      const { title, description, subject, price, duration, level, thumbnail } =
        req.body;

      const existingCourse = await Course.findOne({
        title,
        tutor: req.user.userId,
      });

      if (existingCourse) {
        return res.status(400).json({
          message: "Course already exists",
        });
      }

      const newCourse = await Course.create({
        tutor: req.user.userId,
        title,
        description,
        subject,
        price,
        duration,
        level,
        thumbnail,
      });

      res.status(201).json({
        message: "Course created successfully",
        course: newCourse,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // GET ALL COURSES
  getCourses: async (req, res) => {
    try {
      const courses = await Course.find().populate("tutor", "name email");

      res.status(200).json({
        courses,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // GET SINGLE COURSE
  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate(
        "tutor",
        "name email",
      );

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      res.status(200).json({
        course,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // UPDATE COURSE
  updateCourse: async (req, res) => {
    try {
      const course = await Course.findOne({
        _id: req.params.id,
        tutor: req.user.userId,
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found or unauthorized",
        });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );

      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // DELETE COURSE
  deleteCourse: async (req, res) => {
    try {
      const course = await Course.findOne({
        _id: req.params.id,
        tutor: req.user.userId,
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found or unauthorized",
        });
      }

      await Course.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  // GET MY COURSES
  getMyCourses: async (req, res) => {
    try {
      const courses = await Course.find({
        tutor: req.user.userId,
      });

      res.status(200).json({
        courses,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = courseController;
