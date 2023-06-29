const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.fetchUser = async (userId, next) => {
  try {
    const foundUser = await User.findById(userId);
    if (foundUser) {
      return foundUser;
    }
  } catch (error) {
    return next(error);
  }
};

const hashPassword = async (password, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`exports.signup -> hashedPassword`, hashedPassword);
    return hashedPassword;
  } catch (err) {
    return next(err);
  }
};

const generateToken = (user, next) => {
  try {
    const payload = {
      _id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_MS,
    });

    return token;
  } catch (err) {
    return next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { user } = req.user;

    console.log("exports.signin ->", req);
    const token = generateToken(user, next);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
    // return res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res, next) => {
  try {
    //encrypt the password
    const { password } = req.body;
    req.body.password = await hashPassword(password, next);
    //create user with encrypted password
    const newUser = await User.create(req.body);

    //create token
    const token = generateToken(newUser, next);

    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
    // return res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const foundUser = await User.findById(userId);
    if (foundUser) {
      await foundUser.deleteOne(req.body);
      return res.status(204).end();
    } else {
      return res.status(404).json({ message: "user not found" });
    }

    // await User.findByIdAndRemove({ _id: req.user.id });
    // return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
