require("dotenv").config();
const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { handleSchemaErrors, catchErrors } = require("../utils/utils");

exports.signupUsingEmail = async (req, res, next) => {
  try {
    handleSchemaErrors(req);

    const email = req.body.email;
    const encryptedPassword = req.body.password;
    const decryptedPassword = CryptoJS.AES.decrypt(
      encryptedPassword,
      process?.env?.PRIVATE_KEY_PASSWORD
    ).toString(CryptoJS.enc.Utf8);

    const hashedPw = await bcrypt.hash(decryptedPassword, 12);
    const user = new User({ email, password: hashedPw, tasks: [] });

    const result = await user.save();
    res.status(201).json({ userId: result._id });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.signupUsingDeviceIdAndLogin = async (req, res, next) => {
  try {
    handleSchemaErrors(req);

    const encryptedDeviceId = req.body.deviceId;
    const decryptedDeviceId = CryptoJS.AES.decrypt(
      encryptedDeviceId,
      process?.env?.PRIVATE_KEY_PASSWORD
    ).toString(CryptoJS.enc.Utf8);

    let user = await User.findOne({ deviceId: decryptedDeviceId });

    if (!user) {
      user = new User({ deviceId: decryptedDeviceId, tasks: [] });
      await user.save();
    }

    const token = jwt.sign(
      { deviceId: user.deviceId, userId: user._id.toString() },
      process?.env?.PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    handleSchemaErrors(req);

    const email = req.body.email;
    const encryptedPassword = req.body.password;
    const decryptedPassword = CryptoJS.AES.decrypt(
      encryptedPassword,
      process?.env?.PRIVATE_KEY_PASSWORD
    ).toString(CryptoJS.enc.Utf8);

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(req.jsonLanguage.userCannotBeFound);
      error.statusCode = 403;
      throw error;
    }

    const isEqual = await bcrypt.compare(decryptedPassword, user.password);
    if (!isEqual) {
      const error = new Error(req.jsonLanguage.wrongPassword);
      error.statusCode = 403;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process?.env?.PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({});
  } catch (err) {
    catchErrors(err, next);
  }
};
