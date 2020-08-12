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

router.get('/:name', (req, res, next) => {
    const name = req.params.name;
    if (name === 'Fire') {
        res.status(200).json({
            message: 'You discovered the Fire poketype',
            name: name
        });
    } else {
        res.status(200).json({
            message: 'You passed a name'
        });
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