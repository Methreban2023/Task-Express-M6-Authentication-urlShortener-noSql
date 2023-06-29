const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    //if (Date.now() > jwtPayload.JWT_EXPIRATION_MS * 1000)
    if (Date.now() > jwtPayload.exp * 1000) {
      return done(null, false); // this will throw a 401
    }
    try {
      const username = await User.findById(jwtPayload._id);
      done(null, username); // if there is no user, this will throw a 401
    } catch (error) {
      done(error);
    }
  }
);

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const user = await User.findOne({
        username: username,
      });
      if (!user) {
        return done(null, false);
      }
      let passwordMatch;
      if (user) passwordMatch = await bcrypt.compare(password, user.password);
      else {
        passwordMatch = false;
      }
      if (passwordsMatch) {
        return done(null, user);
      } else return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);
