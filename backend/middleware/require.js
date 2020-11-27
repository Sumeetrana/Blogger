const expressJwt = require("express-jwt");

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
