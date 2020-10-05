const express = require('express');
const router = express.Router();
const moveController = require("../controllers/moveController");

router.get('/names', moveController.getMoveNames);
router.get('/damageclassnames', moveController.getDamageClassNames);
router.post('/', moveController.getMove);

module.exports = router;