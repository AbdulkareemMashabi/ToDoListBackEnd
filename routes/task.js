const express = require("express");
const { body } = require("express-validator");

const User = require("../models/User");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const tasksController = require("../controllers/task");

const router = express.Router();

router.get("/list", isAuth, tasksController.getAllTasks);
router.post("/create-task", isAuth, tasksController.getAllTasks);

// router.post(
//   "/listTasks",
//   [
//     body("email")
//       .isEmail()
//       .withMessage("Please enter a valid email.")
//       .custom(async (value) => {
//         const userDoc = await User.findOne({ email: value });
//         if (userDoc) {
//           return Promise.reject("E-Mail address already exists!");
//         }
//       })
//       .normalizeEmail(),
//     body("password").trim().isLength({ min: 6 }),
//   ],
//   authController.signupUsingEmail
// );

// router.post(
//   "/signupId",
//   [body("deviceId").notEmpty()],
//   authController.signupUsingDeviceIdAndLogin
// );

// router.post("/login", authController.login);

module.exports = router;
