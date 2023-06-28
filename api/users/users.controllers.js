const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_MS,
  });

  return token;
};

exports.signin = async (req, res) => {
  try {
    const { user } = req;

    console.log("exports.signin ->", req);
    const token = createToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res) => {
  try {
    //encrypt the password
    const { password } = req.body;
    req.body.password = await hashedPassword(password);
    //create user with encrypted password
    const newUser = await User.create(req.body);
    console.log(`exports.signup -> hashedPassword`, hashedPassword);
    //create token
    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
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
