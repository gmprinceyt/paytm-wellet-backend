const express = require("express");
const Router = express.Router();
const userRoutes = require("./user");
const accountRouter = require("./account");

Router.use("/user", userRoutes);
Router.use("/account", accountRouter);


module.exports = Router;
