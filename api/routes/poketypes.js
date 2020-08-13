const getDb = require("../../db").getDb;
const express = require('express');
const router = express.Router();

/* since this file is called 'poketypes', all requests starting with .../poketypes/ will be routed here.
therefore, when creating new endpoints involving types, we can exclude the implicit start 'poketypes'  */
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /poketypes'
    });
});

router.post('/', (req, res, next) => {
    const poketype = {
        name: req.body.name,
        color: req.body.color
    }
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdPoketype: poketype
    });
});

router.get('/:name', async (req, res, next) => {
    const name = req.params.name;

    var session = getDb().session();
    try {
        const result = await session.run(
            'MATCH (t:Type {name: $name}) RETURN t',
            { name: name }
        )
        
        const singleRecord = result.records[0]
        const node = singleRecord.get(0)
        
        res.status(200).json({
            message: 'You discovered a poketype',
            poketype: node.properties
        });
    } catch(err) {
        console.log(err);
        res.status(400).json({
            message: 'That type was not found'
        });
    } finally {
        await session.close();
    }
});

router.patch('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Updated poketype!'
    });
});

router.delete('/:name', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted poketype!'
    });
});

module.exports = router;