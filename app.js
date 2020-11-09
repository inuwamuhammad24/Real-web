const express = require("express");
const app = express();
const router = require("./router");
const mongodb = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

let sessionOptions = session({
  secret: "Bright aaaaccccademy jjjjoss",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);
app.use(flash());

app.use(express.static("public"));
app.use(express.static("images"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);
app.set("views", "views");
app.set("view engine", "ejs");

module.exports = app;
