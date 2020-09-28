const pokemonCtx = require("../contexts/pokemonCtx");

exports.getPokemon = async (req, res) => {
    let params = { name: req.params.name ? req.params.name.toLowerCase() : null };
    let pokemon = await pokemonCtx.getPokemon(params);

    if (pokemon && Array.isArray(pokemon)) {
        res.status(200).json({
            message: `Returned ${pokemon.length} pokemon.`,
            pokemon: pokemon
        });
    } else if (!pokemon) {
        res.status(400).json({
            message: 'That pokemon could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};
