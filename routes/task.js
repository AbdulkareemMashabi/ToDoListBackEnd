const express = require("express");

const isAuth = require("../middleware/is-auth");
const tasksController = require("../controllers/task");

const router = express.Router();

router.get("/list", isAuth, tasksController.getAllTasks);
router.post("/create-task", isAuth, tasksController.createTask);

module.exports = router;
