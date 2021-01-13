const express = require('express');
const router = express.Router();
const natureController = require("../controllers/natureController");

router.get('/', natureController.getNatures);

module.exports = router;
