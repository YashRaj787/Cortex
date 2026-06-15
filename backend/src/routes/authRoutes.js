const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, getMe);

module.exports = router;