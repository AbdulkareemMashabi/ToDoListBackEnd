require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGODB_URI = process?.env?.DATABASE_URL;

app.use(bodyParser.json());

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const languages = require("./language");

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, _, next) => {
  const language = req.headers["accept-language"];
  req.jsonLanguage = languages[language];

  next();
});

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

app.use((error, req, res, _) => {
  const status = error.statusCode || 500;
  const message = error.message || req.jsonLanguage["anErrorOccurred"];
  res.status(status).json({ message });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
