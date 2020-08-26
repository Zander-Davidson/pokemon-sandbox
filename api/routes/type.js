const express = require('express');
const typeCtx = require("../contexts/TypeCtx");
const router = express.Router();

/* since this file is called 'types', all requests starting with .../types/ will be routed here.
therefore, when creating new endpoints involving types, we can exclude the implicit start 'types'  */

// get a type by specified name (if none supplied, return all types)
router.get('/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name.toLowerCase() : null;
    let type = await typeCtx.getType(name);

    let numtypes = Array.isArray(type) ? type.length : 1;

    if (type && type !== null) {
        res.status(200).json({
            message: 'Returned ' + numtypes + ' type(s)',
            type: type
        });
    } else if (type === null) {
        res.status(400).json({
            message: 'That type could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/matchup/:attackingType/:defendingType', async (req, res, next) => {
    let attackingType = req.params.attackingType.toLowerCase();
    let defendingType = req.params.defendingType.toLowerCase();
    let matchup = await typeCtx.getTypeMatchup(attackingType, defendingType);

    if (matchup && matchup !== null) {
        res.status(200).json({
            message: 'Returned 1 type matchup',
            matchup: matchup
        });
    } else if (matchup === null) {
        res.status(400).json({
            message: 'One or more types could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/defending-matchup/:defendingType/:multiplier?', async (req, res, next) => {
    let defendingType = req.params.defendingType.toLowerCase();
    let multiplier = parseFloat(req.params.multiplier);
    let matchup = await typeCtx.getMatchupsByDefending(defendingType, multiplier);

    if (matchup && matchup !== null) {
        res.status(200).json({
            message: 'Returned ' + matchup.attacking.length + ' type matchups',
            matchup: matchup
        });
    } else if (matchup === null) {
        res.status(400).json({
            message: 'A type or multiplier could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/attacking-matchup/:attackingType/:multiplier?', async (req, res, next) => {
    let attackingType = req.params.attackingType.toLowerCase();
    let multiplier = parseFloat(req.params.multiplier);
    let matchup = await typeCtx.getMatchupsByAttacking(attackingType, multiplier);

    if (matchup && matchup !== null) {
        res.status(200).json({
            message: 'Returned ' + matchup.defending.length + ' type matchups',
            matchup: matchup
        });
    } else if (matchup === null) {
        res.status(400).json({
            message: 'A type or multiplier could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-types', async (req, res, next) => {
    res.status(201).json({
        message: await itemCtx.createTypes()//'Endpoint unavailable'//
    });
})



// router.patch('/:name', (req, res, next) => {
//     res.status(200).json({
//         message: 'Updated type!'
//     });
// });

// router.delete('/:name', (req, res, next) => {
//     res.status(200).json({
//         message: 'Deleted type!'
//     });
// });





module.exports = router;