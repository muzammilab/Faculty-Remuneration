const express = require("express");
const googleAuthRouter = express.Router();
const passport = require("passport");
const {
  googleLogin,
  googleCallback,
} = require("../controllers/googleAuthController");

googleAuthRouter.get("/auth/google", googleLogin);

googleAuthRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=not_registered",
    session: false,
  }),
  googleCallback
);

module.exports = googleAuthRouter;
