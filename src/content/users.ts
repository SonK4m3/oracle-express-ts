import { Request, Response } from "express";
import users from "../db/user";

export const html = (req: Request, res: Response) => {
  res.send(
    "<ul>" +
      users
        .map((user: { name: string }) => {
          return "<li>" + user.name + "</li>";
        })
        .join("") +
      "</ul>"
  );
};

export const text = (req: Request, res: Response) => {
  res.send(
    users
      .map((user: { name: string }) => {
        return " - " + user.name + "\n";
      })
      .join("")
  );
};

export const json = (req: Request, res: Response) => {
  res.json(users);
};
