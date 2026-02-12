const passport = require("passport");
const { generateToken } = require("../jwt");
require("dotenv").config();

// Step 1: redirect to Google
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// Step 2: Google callback & JWT creation
exports.googleCallback = (req, res) => {
  const token = generateToken({
    id: req.user._id,
    role: req.user.role,
    email: req.user.email,
  });
  res.redirect(`${process.env.FRONTEND_DEV_URL}/oauth-success?token=${token}`);
};
