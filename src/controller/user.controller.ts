import express, { Express, Request, Response } from "express";
import User from "../typings/user";
import users from "../db/user";

var router = express.Router();

const format = (path: string) => {
  const obj = require(path);

  return (req: Request, res: Response) => {
    res.format(obj);
  };
};

router.get("/", format("../content/users.ts"));

router.get("/list", (req: Request, res: Response) => {
  res.format({
    html: function () {
      res.send(
        "<ul>" +
          users
            .map(function (user) {
              return "<li>" + user.name + "</li>";
            })
            .join("") +
          "</ul>"
      );
    },

    text: function () {
      res.send(
        users
          .map(function (user) {
            return " - " + user.name + "\n";
          })
          .join("")
      );
    },

    json: function () {
      res.json(users);
    },
  });
});

router.get("/do/:action/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));

  if (user !== undefined) {
    res.send(`${user.name} do ${req.params.action}`);
  } else {
    const newUser: User = { id: 4, name: "Son 3", age: 21 };

    res.send(`${newUser.name} do ${req.params.action}`);
  }
});

module.exports = router;
