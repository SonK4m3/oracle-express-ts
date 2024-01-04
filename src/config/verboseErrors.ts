import { Application } from "express";
var logger = require("morgan");

const configVerboseErrors = (app: Application, silent: boolean) => {
  app.enable("verbose errors");
  if (app.settings.env === "production") app.disable("verbose errors");
  silent || app.use(logger("dev"));
};

module.exports = configVerboseErrors;
