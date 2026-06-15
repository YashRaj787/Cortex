const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const { authRateLimiter } = require("../middleware/rateLimiter");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, getMe);

module.exports = router;