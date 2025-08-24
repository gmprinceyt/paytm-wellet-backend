const { Router } = require("express");
const {
  SignupRequestBodyValidation,
  SigninRequestBodyValidation,
  UpdateRequestBodyValidation,
} = require("../validation/user");
const { User } = require("../model/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const userRoutes = Router();
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");

userRoutes.post("/signup", async (req, res, next) => {
  try {
    const { data, success, error } = SignupRequestBodyValidation.safeParse(
      req.body
    );
    if (!success) {
      return res.status(422).json({
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
      return res.status(422).json({
        message: error.message,
      });
    }

    const user = await User.findOne({ username: data.username });
    if (!user)
      return res.status(404).json({
        message: "Please SignUp",
      });
    const isCorrectPassword = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isCorrectPassword) {
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

userRoutes.put("/update", authMiddleware, async (req, res) => {
  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  try {
    const { success, error, data } =
      UpdateRequestBodyValidation.safeParse(body);

    if (!success) {
      return res.status(422).json({
        message: error.message,
      });
    }

    const user = await User.findById(req.userId);
    const { firstName, lastName, newPassword, oldPassword } = data;

    //PassWord Update
    if (oldPassword && newPassword) {
      const isCorrectPassword = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isCorrectPassword) {
        return res.status(400).json({ message: "Incorrect Password" });
      }

      user.password = newPassword;
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if ((newPassword && !oldPassword) || (oldPassword && !newPassword)) {
      return res
        .status(400)
        .json({ message: "both field required NewPassword & OldPassword" });
    }

    await user.save();

    res.status(200).json({
      message: "User Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
});

userRoutes.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRoutes;
