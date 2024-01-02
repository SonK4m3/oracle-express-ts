import express, { Express, Request, Response } from "express";
import User from "../typings/user";
var router = express.Router();

var users: User[] = [
  { id: 1, name: "Son 1", age: 21 },
  { id: 2, name: "Son 2", age: 21 },
];

router.get("/list", (req: Request, res: Response) => {
  res.send(users);
});

router.get("/:action/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));

  if (user !== undefined) {
    res.send(`${user.name} do ${req.params.action}`);
  } else {
    const newUser: User = { id: 4, name: "Son 3", age: 21 };

    res.send(`${newUser.name} do ${req.params.action}`);
  }
});

module.exports = router;
