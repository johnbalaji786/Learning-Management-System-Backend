const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllTutors,
  getStudentDashboard,
} = require("../controllers/userController");

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

router.get("/tutors", getAllTutors);

router.get(
  "/student-dashboard",
  isAuthenticated,
  allowRoles(["student"]),
  getStudentDashboard,
);


// Admin only
router.use(isAuthenticated);
router.use(allowRoles(["admin"]));

// GET ALL USERS
router.get("/", getAllUsers);

// BLOCK / UNBLOCK USER
router.put("/:id/status", toggleUserStatus);

// DELETE USER
router.delete("/:id", deleteUser);

module.exports = router;
