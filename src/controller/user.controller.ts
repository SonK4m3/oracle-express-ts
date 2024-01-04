import { Request, Response } from "express";
import User from "../typings/user";
import users from "../db/user";

const createUser = (req: Request, res: Response) => {
  res.send("create user");
};

const updateUser = (req: Request, res: Response) => {
  res.send("update user");
};

const deleteUser = (req: Request, res: Response) => {
  res.send("delete user");
};

const getUserById = (req: Request, res: Response) => {
  const userId = req.params.id;
  res.send("get user " + userId);
};

const userFormat = (req: Request, res: Response) => {
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
};

const userDoAction = (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));

  if (user !== undefined) {
    res.send(`${user.name} do ${req.params.action}`);
  } else {
    const newUser: User = { id: 4, name: "Son 3", age: 21 };

    res.send(`${newUser.name} do ${req.params.action}`);
  }
};

export {
  userFormat,
  userDoAction,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
