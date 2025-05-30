require("dotenv").config();
const CryptoJS = require("crypto-js");

const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signupUsingEmail = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const encryptedPassword = req.body.password;
  const decryptedPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    process?.env?.PRIVATE_KEY_PASSWORD
  ).toString(CryptoJS.enc.Utf8);
  bcrypt
    .hash(decryptedPassword, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        tasks: [],
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signupUsingDeviceIdAndLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const encryptedDeviceId = req.body.deviceId;

  const decryptedDeviceId = CryptoJS.AES.decrypt(
    encryptedDeviceId,
    process?.env?.PRIVATE_KEY_PASSWORD
  ).toString(CryptoJS.enc.Utf8);

  User.findOne({ deviceId: decryptedDeviceId })
    .then((user) => {
      if (!user) {
        const user = new User({
          deviceId: decryptedDeviceId,
          tasks: [],
        });
        return user.save();
      }
      return user;
    })
    .then((user) => {
      const token = jwt.sign(
        {
          deviceId: user?.deviceId,
          userId: user._id.toString(),
        },
        process?.env?.PRIVATE_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: user._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const encryptedPassword = req.body.password;
  const decryptedPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    process?.env?.PRIVATE_KEY_PASSWORD
  ).toString(CryptoJS.enc.Utf8);
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 403;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(decryptedPassword, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 403;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process?.env?.PRIVATE_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteAccount = (req, res, next) => {
  User.findByIdAndDelete(req.userId)
    .then(() => {
      return res.json({});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
