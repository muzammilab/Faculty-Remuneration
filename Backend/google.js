const passport = require("passport");
const admin = require("./models/admin");
const faculty = require("./models/faculty");
require("dotenv").config();

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      console.log("Google Profile:", profile); // Debugging line to check profile data
      const email = profile.emails[0].value;

      // const user = await admin.findOne({ email });
      const user =
        (await admin.findOne({ email })) || (await faculty.findOne({ email }));

      if (!user) {
        // 🚫 Block unknown Gmail users
        return done(null, false);
      }

      return done(null, user);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = (await admin.findById(id)) || (await faculty.findById(id));
  done(null, user);
});

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await admin.findById(id);
//   done(null, user);
// });
// Google OAuth Strategy
