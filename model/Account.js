const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 1000,
    required: true,
  },
});

const Account = mongoose.model("balance", AccountSchema);

module.exports = {
  Account,
};
