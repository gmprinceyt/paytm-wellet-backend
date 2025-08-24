const express = require("express");
const cors = require("cors")
const connect = require("./config/db");
const app = express();

app.use(express.json())
app.use(cors())


// Import Routes 
const Router = require("./routes/index");
const userRoutes = require("./routes/user");

app.use("/api/v1", Router)
app.use("/api/v1/user", userRoutes);

app.use((err,req,res,next)=> {
    console.log(err)
    res.status(500).json({
        message: err.message,
        err,
        success: false
    })
})


connect().then(() => app.listen(3000, () => console.log("Server Started At http://localhost:3000")));
