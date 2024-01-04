import express from "express";
import {
  userFormat,
  userDoAction,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../controller/user.controller";

var router = express.Router();

router.get("/list", userFormat);

router.get("/do/:action/:id", userDoAction);

router.post("/create", createUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);
router.get("/:id", getUserById);

module.exports = router;
