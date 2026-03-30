const express = require("express");
const {
	signup,
	login,
	getMe,
	adminLogin,
	getAdminMe,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/admin/login", adminLogin);
router.get("/admin/me", adminAuthMiddleware, getAdminMe);

module.exports = router;
