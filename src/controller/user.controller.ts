import { Request, Response } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  getSingleUser,
  deleteUser,
  createUserTable,
} from "../service/userService";

interface IUser {
  id: number;
  username: string;
  email: string;
}

const validateUser = (body: any): body is IUser => {
  return (
    typeof body.id === "number" &&
    typeof body.username === "string" &&
    typeof body.email === "string"
  );
};

const createUserTableHandler = async (req: Request, res: Response) => {
  createUserTable();
  res.json("created user table");
};

const createUserHandler = async (req: Request, res: Response) => {
  if (!validateUser(req.body)) {
    return res.status(400).send("Invalid user data");
  }

  const user = req.body as IUser;
  await createUser(user);
  const message = {
    message: "User created",
  };
  res.json(message);
};

const updateUserHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!validateUser(req.body)) {
    return res.status(400).send("Invalid user data");
  }

  const user = req.body as IUser;
  await updateUser(id, user);
  res.json("update user");
};

const deleteUserHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  await deleteUser(id);
  res.json("delete user");
};

const getUsersHandler = async (req: Request, res: Response) => {
  const users = (await getUsers()) as IUser[];
  res.json(users);
};

const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = await getSingleUser(userId);

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  res.json(user);
};

const userFormat = async (req: Request, res: Response) => {
  const users = (await getUsers()) as IUser[];
  res.format({
    html: function () {
      res.send(
        "<ul>" +
          users
            .map(({ username, email }) => {
              return "<li>" + username + " - " + email + "</li>";
            })
            .join("") +
          "</ul>"
      );
    },

    text: function () {
      res.send(
        users
          .map(function (user: IUser) {
            return " - " + user.username + "\n";
          })
          .join("")
      );
    },

    json: function () {
      res.json(users);
    },
  });
};

export {
  userFormat,
  createUserTableHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserById,
};
