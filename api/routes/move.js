const express = require('express');
const moveCtx = require("../contexts/MoveCtx");
const router = express.Router();

router.get('/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name.toLowerCase() : null;
    let move = await moveCtx.getMove(name);

    let num = Array.isArray(move) ? move.length : 1;

    if (move && move !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' move(s)',
            move: move
        });
    } else if (move === null) {
        res.status(400).json({
            message: 'That move could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/', async (req, res, next) => {
    const moveData = {
        name: req.body.name,
        effect: req.body.effect
    };

    let newMove = await moveCtx.createMove(moveData);

    if (move && move !== null) {
        res.status(201).json({
            message: 'Move created',
            move: newMove 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-pokeapi-moves', async (req, res, next) => {
    res.status(201).json({
        message: await moveCtx.createPokeapiMoves()
    });
})

module.exports = router;