import express, { NextFunction, Request, Response } from "express";
import {
  userFormat,
  createUserHandler,
  deleteUserHandler,
  getUserById,
  updateUserHandler,
  createUserTableHandler,
} from "../controller/user.controller";

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

router.post("/user-schema", createUserTableHandler);

router.get("/", userFormat);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);
router.get("/:id", getUserById);

module.exports = router;
