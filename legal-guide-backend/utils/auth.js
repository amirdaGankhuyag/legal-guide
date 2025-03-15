const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../models/User");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile?.emails[0].value });
        if (!user) {
          const user_cr = await User.create({
            name: profile?.name.givenName,
            email: profile?.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          const token = user_cr.getJsonWebToken();
          return cb(null, token);
        }
        const token = user.getJsonWebToken();
        return cb(null, token);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;