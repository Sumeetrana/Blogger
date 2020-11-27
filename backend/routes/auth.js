const express = require("express");
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/auth");
const User = require("../models/User");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const {requireSignIn} = require("../middleware/require");
const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: "Email is taken." });
    }
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
});

router.post("/signin", userSigninValidator, runValidation, (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Email does not exist." });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Password does not match",
      });
    }

    // generatea a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, name, username, email, role } = user;

    return res.json({
      token,
      user: { _id, name, username, email, role },
    });
  });
});

router.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
});


router.get("/secret", requireSignIn, (req, res) => {
  res.json("Secret page");
});

module.exports = router;
