const User = require("../models/User");
const Task = require("../models/Task");
const { handleFavoriteTask } = require("../utils/utils");

exports.getAllTasks = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("tasks");
    res.status(200).json({ data: user?.tasks || [] });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.createTask = async (req, res, next) => {
  try {
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

    const createdTask = await newTask.save();
    const user = await User.findById(req.userId);

    user.tasks.push(createdTask);
    await user.save();

    res.status(201).json({ task: createdTask });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { taskId, newValues } = req?.body;
    const task = await Task.findById(taskId);

    if (!task) throw new Error(req.jsonLanguage.taskNotFound);

    Object.assign(task, newValues);
    await task.save();

    res.json({});
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId, newValues } = req?.body;
    const { subTasks, status } = newValues || {};
    let isAllSubTasksCompleted = subTasks?.length;

    const task = await Task.findById(taskId);
    if (!task) throw new Error(req.jsonLanguage.taskNotFound);

    const isMainCompleted = status;

    if (isAllSubTasksCompleted) {
      isAllSubTasksCompleted = subTasks.every((subTask) => subTask.status);
    }

    if (isMainCompleted || isAllSubTasksCompleted) {
      newValues.status = true;
      newValues.subTasks?.forEach((item) => (item.status = true));
    }

    Object.assign(task, newValues);
    await task.save();

    res.json({ updatedTask: task });
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.updateFavorite = async (req, res, next) => {
  try {
    const { taskId } = req?.body;
    const user = await User.findById(req.userId).populate("tasks");

    if (!user) throw new Error(req.jsonLanguage.userNotFound);

    await handleFavoriteTask(taskId, user);
    res.status(200).json({});
  } catch (err) {
    catchErrors(err, next);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req?.body;
    await Task.findByIdAndDelete(taskId);
    res.json({});
  } catch (err) {
    catchErrors(err, next);
  }
};
