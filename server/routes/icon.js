const express = require('express');
const router = express.Router();
const iconController = require("../controllers/iconController");

router.get(
    '/:name?',
    iconController.getIcon
);

module.exports = router;