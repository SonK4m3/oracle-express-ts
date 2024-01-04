import express, { NextFunction, Request, Response } from "express";
import {
  userFormat,
  userDoAction,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../controller/user.controller";
import User from "../typings/user";

var router = express.Router();

declare module "express" {
  export interface Request {
    user?: any;
  }
}

router.param(
  "id",
  (req: Request, res: Response, next: NextFunction, id: string) => {
    const paramValue = id;

    if (!paramValue) {
      // If the 'id' parameter is not provided, move to the next middleware
      return next();
    }

    const numericValue = parseInt(paramValue, 10);

    if (isNaN(numericValue)) {
      // If parsing to a number fails, create an error and pass it to the error handler
      const error = new Error("Invalid ID");
      return next(error);
    }
    next();
  }
);

router.get("/", userFormat);

router.get("/do/:action/:id", userDoAction);

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUserById);

module.exports = router;
