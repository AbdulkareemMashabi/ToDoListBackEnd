const User = require("../models/User");
const Task = require("../models/Task");
const { handleFavoriteTask } = require("../utils/utils");

exports.getAllTasks = (req, res, next) => {
  User.findById(req.userId)
    .populate("tasks")
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

exports.updateTask = (req, res, next) => {
  const { taskId, newValues } = req?.body;

  Task.findById(taskId)
    .then((task) => {
      Object.assign(task, newValues); // Merge new values into the task object
      return task.save();
    })
    .then((task) => {
      res.json({ newData: task });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTaskStatus = (req, res, next) => {
  const { taskId, newValues } = req?.body;
  const { subTasks, status } = newValues || {};
  let isAllSubTasksCompleted = subTasks?.length;

  Task.findById(taskId)
    .then((task) => {
      const isMainCompleted = status;

      for (let i = 0; i < subTasks.length; i++) {
        if (!subTasks[i].status) {
          isAllSubTasksCompleted = false;
          break;
        }
      }

      if (isMainCompleted || isAllSubTasksCompleted) {
        newValues.status = true;
        newValues.subTasks.forEach((item) => {
          item.status = true;
        });
      }

      Object.assign(task, newValues); // Merge new values into the task object
      return task.save();
    })
    .then((task) => {
      res.json({});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateFavorite = (req, res, next) => {
  const { taskId } = req?.body;
  User.findById(req.userId)
    .populate("tasks")
    .then(async (user) => {
      return await handleFavoriteTask(taskId, user);
    })
    .then((user) => {
      res.status(200).json({});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTask = (req, res, next) => {
  const { taskId } = req?.body;
  Task.findByIdAndDelete(taskId)
    .then(() => {
      res.json({});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
