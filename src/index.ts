import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";

const configViewEngine = require("./config/viewEngine");
var session = require("express-session");
var apiRoutes = require("./routes/api");

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8081;

// config
configViewEngine(app);

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: { maxAge: 60 * 1000 },
  })
);

// session-persisted message middleware

interface User {
  name: string;
}

declare module "express-session" {
  interface SessionData {
    error: string;
    success: string;
    user: User;
  }
}

app.use(function (req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;

  res.locals.message = "";
  if (err) res.locals.message = '<p class="msg error">' + err + "</p>";
  if (msg) res.locals.message = '<p class="msg success">' + msg + "</p>";
  next();
});

var myUser: User = {
  name: "tj",
};

function authenticate(
  name: string,
  pass: string,
  fn: { (err: string | null, user: User | null): void }
) {
  if (!module.parent) console.log("authenticating %s:%s", name, pass);

  var user: User | null = myUser.name === name ? myUser : null;
  if (!user) return fn(null, null);
  if (pass !== "foobar") return fn("Your password is incorrect", null);
  return fn(null, user);
}

function restrict(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = "Access denied!";
    res.redirect("/login");
  }
}

app.get("/", (req: Request, res: Response) => {
  console.log(req);
  res.redirect("/login");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  authenticate(
    req.body.username,
    req.body.password,
    (err: string | null, user: User | null) => {
      if (err) {
        req.session.error = err;
        return res.redirect("back");
      }

      if (user) {
        req.session.regenerate(() => {
          req.session.user = user;
          req.session.success =
            "Authenticated as " +
            user.name +
            ' click to <a href="/logout">logout</a>. ' +
            ' You may now access <a href="/restricted">/restricted</a>.';
          res.redirect("back");
        });
      } else {
        req.session.error =
          "Authentication failed, please check your " +
          " username and password." +
          ' (use "tj" and "foobar")';
        res.redirect("/login");
      }
    }
  );
});

app.get("/restricted", restrict, (req: Request, res: Response) => {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.use("/v1/api", apiRoutes);

app.get("*", (req: Request, res: Response) => {
  res.send("Sorry, this is invalid URL");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
