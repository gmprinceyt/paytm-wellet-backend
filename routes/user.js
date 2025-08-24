const { Router } = require("express");
const {
  SignupRequestBodyValidation,
  SigninRequestBodyValidation,
} = require("../validation/user");
const { User } = require("../model/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const userRoutes = Router();
const bcrypt = require("bcrypt");

userRoutes.post("/signup", async (req, res, next) => {
  try {
    const { data, success, error } = SignupRequestBodyValidation.safeParse(
      req.body
    );
    if (!success) {
      return res.status(411).json({
        error: error.message,
        message: "User Validation Error ",
      });
    }

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
    const user = await User.create(data);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).json({
      message: "User Create Successfully ✅",
      token,
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.post("/signin", async (req, res) => {
  try {
    const { success, data, error } = SigninRequestBodyValidation.safeParse(
      req.body
    );
    if (!success) {
      return res.status(411).json({
        message: error.message,
      });
    }

    const user = await User.findOne({ username: data.username });
    if (!user)
      return res.status(404).json({
        message: "Please SignUp",
      });
    const comparePassword = await bcrypt.compare(data.password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({
      message: "User Login Successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRoutes;
