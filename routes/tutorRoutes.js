const express = require("express");

const router = express.Router();

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const {
  getTutorDashboard,
  getTutorAvailability,
  updateTutorAvailability,
} = require("../controllers/tutorController");

router.use(isAuthenticated);
router.use(allowRoles(["tutor"]));

router.get("/dashboard", getTutorDashboard);
router.get("/availability", getTutorAvailability);
router.put("/availability", updateTutorAvailability);
module.exports = router;
