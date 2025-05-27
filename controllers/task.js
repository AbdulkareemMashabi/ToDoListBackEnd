const { validationResult } = require("express-validator");
const User = require("../models/User");
const Task = require("../models/Task");

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

  const { title, date, description, calendarId, color } = req?.body;

  const newTask = new Task({
    title,
    date,
    description,
    calendarId,
    color,
    subTasks: [],
    creator: req.userId,
  });
  newTask
    .save()
    .then(async (task) => {
      const user = await User.findById(req.userId);
      user.tasks.push(task);
      return await user.save();
    })
    .then(() => {
      res.status(201).json({});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
