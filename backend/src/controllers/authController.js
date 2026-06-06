const authService = require("../services/authService");

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
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