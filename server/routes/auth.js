const express = require('express');
const router = express.Router();
const { verifySignup } = require("../middleware");
const authController = require("../controllers/authController");

router.post(
    '/signup',
    [verifySignup.checkDuplicateUsernameOrEmail],
    authController.signup
);

router.post(
    '/login',
    authController.login
);

module.exports = router;