import { Application, static as static_ } from "express";
var path = require("path");

const configViewEngine = (app: Application) => {
  app.set("view engine", "ejs");
  // app.engine("ejs", require("ejs").__express);
  app.set("views", path.join("./src", "views"));
  app.use(static_("public"));
};

module.exports = configViewEngine;
