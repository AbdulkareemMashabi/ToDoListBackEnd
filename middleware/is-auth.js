require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, _, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error(req.jsonLanguage.notAuthenticated);
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process?.env?.PRIVATE_KEY);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error(req.jsonLanguage.notAuthenticated);
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
