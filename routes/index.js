const express = require("express");
const Router = express.Router();
const userRoutes = require("./user");
const accountRouter = require("./account");
const authMiddleware = require("../middleware/auth");

Router.use("/user", userRoutes);
Router.use("/account", authMiddleware, accountRouter);


module.exports = Router;
