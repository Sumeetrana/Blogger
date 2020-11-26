const express = require("express");
const { runValidation } = require("../validators");
const { userSignupValidator } = require("../validators/auth");
const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
});

module.exports = router;
