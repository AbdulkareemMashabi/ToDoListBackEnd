const express = require("express");
const { body } = require("express-validator");

const User = require("../models/User");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
  ],
  authController.signupUsingEmail
);

router.post(
  "/signup-Id",
  [body("deviceId").notEmpty()],
  authController.signupUsingDeviceIdAndLogin
);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (!userDoc) {
        return Promise.reject("E-Mail address does not exists!");
      }
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 6 }),
  authController.login
);

router.delete("/delete-account", isAuth, authController.deleteAccount);

module.exports = router;
