import express from "express";
var router = express.Router();
var userRoutes = require("./user.route");

router.use("/user", userRoutes);

module.exports = router;
