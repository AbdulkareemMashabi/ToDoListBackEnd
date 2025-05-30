const express = require("express");

const isAuth = require("../middleware/is-auth");
const tasksController = require("../controllers/task");

const router = express.Router();

router.get("/list", isAuth, tasksController.getAllTasks);
router.post("/create-task", isAuth, tasksController.createTask);
router.put("/update-task", isAuth, tasksController.updateTask);
router.put("/update-status", isAuth, tasksController.updateTaskStatus);
router.put("/update-favorite", isAuth, tasksController.updateFavorite);
router.delete("/delete-task", isAuth, tasksController.deleteTask);

module.exports = router;
