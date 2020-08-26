const express = require('express');
const pokemonCtx = require("../contexts/PokemonCtx");
const router = express.Router();

router.get('/:name?', async (req, res, next) => {
    let name = req.params.name ? req.params.name.toLowerCase() : null;
    let pokemon = await pokemonCtx.getPokemon(name);

    let num = Array.isArray(pokemon) ? pokemon.length : 1;

    if (pokemon && pokemon !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' pokemon(s)',
            pokemon: pokemon
        });
    } else if (pokemon === null) {
        res.status(400).json({
            message: 'That pokemon could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.get('/by-type/:typeName', async (req, res, next) => {
    let typeName = req.params.typeName ? req.params.typeName.toLowerCase() : null;
    let pokemon = await pokemonCtx.getPokemonsByType(typeName);

    let num = Array.isArray(pokemon) ? pokemon.length : 1;

    if (pokemon && pokemon !== null) {
        res.status(200).json({
            message: 'Returned ' + num + ' pokemon(s)',
            pokemon: pokemon
        });
    } else if (pokemon === null) {
        res.status(400).json({
            message: 'That pokemon could not be found, or there was an error with the db query '
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/', async (req, res, next) => {
    const pokemonData = {
        name: req.body.name,
        effect: req.body.effect
    };

    let newPokemon = await pokemonCtx.createPokemon(pokemonData);

    if (pokemon && pokemon !== null) {
        res.status(201).json({
            message: 'Pokemon created',
            pokemon: newPokemon 
        });
    } else {
        res.status(500).json({
            message: 'An error occurred while trying to query the database (check the db logs for more details)'
        });
    }
});

router.post('/create-pokeapi-pokemons', async (req, res, next) => {
    res.status(201).json({
        message: await pokemonCtx.createPokeapiPokemons()//'Endpoint unavailable'//
    });
})

module.exports = router;