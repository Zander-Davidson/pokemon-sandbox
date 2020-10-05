const express = require('express');
const router = express.Router();
const abilityController = require("../controllers/abilityController");

router.get('/names', abilityController.getAbilityNames);
router.get('/:name?', abilityController.getAbility);

module.exports = router;