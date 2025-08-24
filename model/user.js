const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: 50,
    minLength: [5, "fullName miniuim 5 charctor long"],
  },
  firstName: {
    type: String,
    minLength: [3, "fullName miniuim 3 charctor long"],
    required: true,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    minLength: [3, "fullName miniuim 3 charctor long"],
    trim: true,
    maxLength: 50,
  },
  password: {
    type: String,
    minLength: [6, "fullName miniuim 5 charctor long"],
    required: true,
  },
});

userSchema.pre("save", async function () {
  const sult = await bcrypt.genSalt(9);
  const password = await bcrypt.hash(this.password, sult);
  this.password = password;
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
