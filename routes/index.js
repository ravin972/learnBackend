var express = require("express");
var router = express.Router();
const userModel = require("./users");
const { search } = require("../app");
const localStrategy = require("passport-local");
const passport = require("passport");

passport.use(new localStrategy(userModel.authenticate()));

// register route
router.post("/register", (req, res) => {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
  });
  userModel.register(userdata, req.body.password).then((registerreduser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

// code for login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

// code for logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// code isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile");
});

router.get("/failed", function (req, res) {
  req.flash("error", 404);
  res.send("Created!");
});

router.get("/checkFailed", function (req, res) {
  console.log(req.flash("error"));
  res.send("Check the console!");
});

router.get("/create", async function (req, res) {
  let userData = await userModel.create({
    username: "ravinder",
    nickname: "ravin",
    description: "A boy who wanna be-",
    categories: ["js", "java", "react", "node"],
  });
  res.send(userData);
});

router.get("/find", async function (req, res) {
  // new RegExp(search, flags)
  // ^ - how's the start?
  // $ - how's the end?
  var date1 = new Date("2023-11-12");
  var date1 = new Date("2023-11-13");

  // how can i perform a case-sensitive search in Mongoose?
  var regex = new RegExp("^Ravi$", "i");
  let user = await userModel.find({ username: regex });

  // how do i find documents where an array field contains all of a set of values?
  let userAll = await userModel.find({ categories: { $all: ["node"] } });

  // how can i search for documents with a specific data range in mongoose?
  let userByDate = await userModel.find({ date: { $gte: date1, $lte: date2 } });

  // how can i filter documents based on the existence of a field in mongoose?
  let usersExistence = await userModel.find({ categories: { $exists: true } });

  // how can i filter documents based on a specific field's length in mongoose?
  let userFindByThisMethod = userModel.find({
    $expr: {
      $and: [
        { $gte: [{ $strLenCP: "$nickname" }, 0] },
        { $lte: [{ $strLenCP: "$nickname" }, 12] },
      ],
    },
  });
  res.send(userAll);
  res.send(user);
  res.send(userByDate);
});

module.exports = router;
