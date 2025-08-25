const { Router } = require("express");
const { Account, Transaction } = require("../model/Account");
const { default: mongoose } = require("mongoose");
const { CustomError } = require("../config/ErrorHander");
const z = require("zod");
const accountRouter = Router();

accountRouter.get("/balance", async (req, res, next) => {
  try {
    const balance = await Account.findOne({ userId: req.userId });
    res.status(200).json({
      balance: balance.balance,
    });
  } catch (error) {
    next(error);
  }
});

// Amount Validation
const validAmount = z.object({
  amount: z
    .number()
    .min(1)
    .refine(
      (num) => num.toString().length <= 12,
      "Amount Must Be Less Then 12 Digit "
    ),
});


// Resolve Replica Errror  !
accountRouter.post("/transfer/:recipientId", async (req, res, next) => {
  const { recipientId } = req.params;
  const senderId = req.userId;

  if (!recipientId) {
    return next(new CustomError("Recipient Id Not Found!", 404));
  }

  // validate Amount
  const { data, success, error } = validAmount.safeParse(req.body);
  if (!success) {
    return next(new CustomError(error.message, 411));
  }

  // transactions session
  const session = await mongoose.startSession();

  try {
    const { amount } = data;
    // Transaction Callback
    await session.withTransaction(async () => {
      const recipient = await Account.findById(recipientId).session(session);
      const sender = await Account.findOne({userId: senderId}).session(session);

      if (!recipient) {
        return next(new CustomError("Recipient Not Found", 404));
      }
      if (!sender) {
        return next(new CustomError("Sender Not Found", 404));
      }
      console.log(sender.balance , amount)
      if (sender.balance < amount) {
        return next(new CustomError("Insufficient balance.", 402))
      }

      sender.balance -= amount;
      recipient.balance += amount;

      await sender.save({ session });
      await recipient.save({ session });
      // Transaction History
      const transaction = new Transaction({
        sender: senderId,
        recipient: recipientId,
        amount: sender.balance,
      });
      await transaction.save({ session });

    });
    res.status(200).json({
      message: "Payment Success",
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = accountRouter;
