const express  = require("express");
const Router = express.Router();


Router.get("/", (req,res)=> {
    res.status(200).json({
        message: "Working Fine All Routes"
    })
} )

module.exports = Router