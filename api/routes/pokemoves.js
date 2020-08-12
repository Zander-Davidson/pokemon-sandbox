const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Moves were fetched!'
    });
});

router.post('/', (req, res, next) => {
    const pokemove = {
        name: req.body.name,
        damage: req.body.damage
    }
    res.status(201).json({
        message: 'Move was created!',
        createdPokemove: pokemove
    });
});

router.get('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Move details',
        name: req.params.name
    });
});

router.delete('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Move deleted',
        name: req.params.name
    });
});

module.exports = router;