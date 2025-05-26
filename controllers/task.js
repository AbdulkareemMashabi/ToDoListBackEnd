const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.getAllTasks = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  User.findById(req.userId)
    .then((user) => {
      res.status(200).json({ data: user?.tasks });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { title, date, description } = req?.body;

  User.findById(req.userId)
    .then((user) => {
      user.tasks.push({
        title,
        date,
        description,
        subTasks: [],
      });
      return user.save();
    })
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
