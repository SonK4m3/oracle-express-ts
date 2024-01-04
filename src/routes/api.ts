import express from "express";
var router = express.Router();
var userRoutes = require("./user.route");

router.use("/users", userRoutes);

module.exports = router;
