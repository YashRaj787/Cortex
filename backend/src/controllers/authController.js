const authService = require("../services/authService");
const logger = require("../utils/logger");

const signup = async (req, res, next) => {
  try {
  const user = await authService.signup(req.body);
  logger.info({msg: "User signup successful", userId: user.id});
  res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
  const token = await authService.login(req.body);
  logger.info({msg: "User login successful", email: req.body.email});
  res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getMe,
};