const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided."
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized."
      });
    }
    req.user_id = decoded.user_id;
    next();
  });
};

// // for implementing database roles
// const isAdmin = (req, res, next) => {};
// const isModerator = (req, res, next) => {};
// const isModeratorOrAdmin = (req, res, next) => {};

const authJwt = {
  verifyToken: verifyToken
};

module.exports = authJwt;