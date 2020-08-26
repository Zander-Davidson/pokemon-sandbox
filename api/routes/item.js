const express = require('express');
const itemCtx = require("../contexts/ItemCtx");
const router = express.Router();

router.get('/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name.toLowerCase() : null;
    let item = await itemCtx.getItem(name);

    let num = Array.isArray(item) ? item.length : 1;

    if (item && item !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' item(s)',
            item: item
        });
    } else if (item === null) {
        res.status(400).json({
            message: 'That item could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/by-type/:typeName', async (req, res, next) => {
    let typeName = req.params.typeName ? req.params.typeName.toLowerCase() : null;
    let item = await itemCtx.getItemsByType(typeName);

    let num = Array.isArray(item) ? item.length : 1;

    if (item && item !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' item(s)',
            item: item
        });
    } else if (item === null) {
        res.status(400).json({
            message: 'That item could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/', async (req, res, next) => {
    const itemData = {
        name: req.body.name,
        effect: req.body.effect
    };

    let newItem = await itemCtx.createItem(itemData);

    if (item && item !== null) {
        res.status(201).json({
            message: 'Item created',
            item: newItem 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-pokeapi-items', async (req, res, next) => {
    res.status(201).json({
        message: await itemCtx.createPokeapiItems()//'Endpoint unavailable'//
    });
})

module.exports = router;