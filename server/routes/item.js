const express = require('express');
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get('/names', itemController.getItemNames);

router.get(
    '/:name?',
    itemController.getItem
);

module.exports = router;