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

router.post('/', async (req, res, next) => {
    const abilityData = {
        name: req.body.name,
        effect: req.body.effect
    };

    let newAbility = await abilityCtx.createAbility(abilityData);

    if (ability && ability !== null) {
        res.status(201).json({
            message: 'Ability created',
            ability: newAbility 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-pokeapi-abilities', async (req, res, next) => {
    res.status(201).json({
        message: await abilityCtx.createPokeapiAbilities()//'Endpoint unavailable'//
    });
})

module.exports = router;