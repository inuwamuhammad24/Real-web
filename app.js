const express = require("express");
const mongodb = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const csrf = require('csurf')
const app = express();

const router = require("./router");

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

app.use(csrf())

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/", router);

app.use(function(err, req, res, next) {
  if (err) {
    if (err.code == 'EBADCSRFTOKEN') {
      req.flash('errors', 'cross site request forgery detected')
      req.session.save(() => res.redirect('/'))
    } else {
      res.redirect('/')
    }
  }
})
app.set("views", "views");
app.set("view engine", "ejs");

module.exports = app;
