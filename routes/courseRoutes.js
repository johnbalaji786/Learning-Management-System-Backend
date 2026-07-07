const express = require("express");

const courseRouter = express.Router();

const courseController = require("../controllers/courseController");

const { isAuthenticated } = require("../middlewares/auth");

// CREATE COURSE
courseRouter.post("/", isAuthenticated, courseController.createCourse);

// GET ALL COURSES
courseRouter.get("/", courseController.getCourses);

courseRouter.get("/my-courses", isAuthenticated, courseController.getMyCourses);

// GET SINGLE COURSE
courseRouter.get("/:id", courseController.getCourseById);

// UPDATE COURSE
courseRouter.put("/:id", isAuthenticated, courseController.updateCourse);

// DELETE COURSE
courseRouter.delete("/:id", isAuthenticated, courseController.deleteCourse);

module.exports = courseRouter;
