const express = require('express');
const abilityCtx = require("../contexts/AbilityCtx");
const router = express.Router();

router.get('/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name.toLowerCase() : null;
    let ability = await abilityCtx.getAbility(name);

    let num = Array.isArray(ability) ? ability.length : 1;

    if (ability && ability !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' ability(s)',
            ability: ability
        });
    } else if (ability === null) {
        res.status(400).json({
            message: 'That ability could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/', (req, res, next) => {
    const ability = {
        name: req.body.name,
        description: req.body.description,
        isMainSeries: req.body.isMainSeries
    }
    res.status(201).json({
        message: 'Move was created!',
        createdPokemove: pokemove
    });
});

module.exports = router;