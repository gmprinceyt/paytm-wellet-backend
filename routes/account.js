const { Router } = require("express");
const authMiddleware = require("../middleware/auth");
const { Account } = require("../model/Account");
const accountRouter = Router();

accountRouter.get("/balance", authMiddleware, async (req, res, next) => {
  try {
    const balance = await Account.findOne({ userId: req.userId });
    res.status(200).json({
      balance: balance.balance,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = accountRouter;
