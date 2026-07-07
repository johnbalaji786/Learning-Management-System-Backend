const express = require("express");

const router = express.Router();

const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/adminController");

router.use(isAuthenticated);
router.use(allowRoles(["admin"]));

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);

router.put("/users/:id/toggle", toggleUserStatus);

module.exports = router;
