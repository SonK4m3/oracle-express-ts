import express, {
  Request,
  Response,
  Application,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";

var configViewEngine = require("./config/viewEngine");
var configVerboseErrors = require("./config/verboseErrors");
var session = require("express-session");
var apiRoutes = require("./routes/api");

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8081;
const silent = process.env.NODE_ENV === "debug";

// config
configViewEngine(app);
configVerboseErrors(app, silent);

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

app.use("/api/v1", apiRoutes);

// app.get("*", (req: Request, res: Response) => {
//   res.send('Sorry, this is invalid URL. <a href="/logout">Go back</a>');
// });

app.get("/404", (req: Request, res: Response, next: NextFunction) => {
  next();
});

app.get("/403", (req: Request, res: Response, next: NextFunction) => {
  var err = new Error("not allowed!");
  (err as any).status = 403;
  next(err);
});

app.get("/500", (req: Request, res: Response, next: NextFunction) => {
  next(new Error("keyboard cat!"));
});

app.use((req: Request, res: Response) => {
  res.status(404);

  res.format({
    html: function () {
      res.render("error/404", { url: req.url });
    },
    json: function () {
      res.json({ error: "Not found" });
    },
    default: function () {
      res.type("txt").send("Not found");
    },
  });
});

app.use(((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error/500", { error: err });
  // res.status(400).json({ error: err.message });
}) as ErrorRequestHandler);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
