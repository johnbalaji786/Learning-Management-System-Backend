const express = require("express");

const router = express.Router();

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const { getTutorDashboard } = require("../controllers/tutorController");

router.use(isAuthenticated);
router.use(allowRoles(["tutor"]));

router.get("/dashboard", getTutorDashboard);

module.exports = router;
