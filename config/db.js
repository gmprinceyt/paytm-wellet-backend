const mongoose = require("mongoose");

const connnect = async () => {
  try {
    const dbinstence = await mongoose.connect("mongodb://localhost:27017/paytm");
    console.log(dbinstence.connection.host + " MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Connection Failed ", error);
  }
};

module.exports = connnect;
