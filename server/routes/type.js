const express = require('express');
const router = express.Router();
const typeController = require("../controllers/typeController");

/* since this file is called 'types', all requests starting with .../types/ will be routed here.
therefore, when creating new endpoints involving types, we can exclude the implicit start 'types'  */

// get a type by specified name (if none supplied, return all types)
router.get(
    '/:name?',
    typeController.getType    
);

router.get(
    '/matchup/:attacking/:defending',
    typeController.getTypeMatchup
);

router.get(
    '/defendingmatchup/:defending/:multiplier?',
    typeController.getMatchupsByDefending
);

router.get(
    '/attackingmatchup/:attacking/:multiplier?',
    typeController.getMatchupsByAttacking
);

module.exports = router;