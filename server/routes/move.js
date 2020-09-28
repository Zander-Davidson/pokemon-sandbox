const express = require('express');
const router = express.Router();
const moveController = require("../controllers/moveController");

router.get(
    '/:name?',
    moveController.getMove
);

router.get(
    '/bytype/:typeName',
    moveController.getMovesByType
);

module.exports = router;