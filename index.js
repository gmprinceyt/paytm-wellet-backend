const express = require("express");
const cors = require("cors");
const { ErrorHandler } = require("./config/ErrorHander");
const connect = require("./config/db");
const app = express();

// global Middleware 
app.use(express.json());
app.use(cors());

//Routes
const Router = require("./routes/index");
app.use("/api/v1", Router);


// global Error Handler 
app.use(ErrorHandler);

connect().then(() =>
  app.listen(3000, () => console.log("Server Started At http://localhost:3000"))
);
