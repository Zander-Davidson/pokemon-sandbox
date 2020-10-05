const pokemonCtx = require("../contexts/pokemonCtx");

exports.getPokemonNames = async (req, res) => {
    let pokemonNames = await pokemonCtx.getPokemonNames();

    if (pokemonNames && Array.isArray(pokemonNames)) {
        res.status(200).json({
            message: `Returned ${pokemonNames.length} pokemon names.`,
            pokemonNames: pokemonNames
        });
    }  else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.getPokemon = async (req, res) => {
    // all sort/filter params are optional. if no sort/filter specifed, return first 50 pokemon sorted by game_id ASC
    let params = req.body;
    let { offset, limit, total, names, pokemon } = await pokemonCtx.getPokemon(params);

    if (pokemon && Array.isArray(pokemon)) {
        res.status(200).json({
            message: `Returned ${pokemon.length} out of ${total} pokemon.`,
            offset: offset,
            limit: limit,
            total: total,
            names: names,
            pokemon: pokemon
        });
    } else if (!pokemon) {
        res.status(400).json({
            message: 'There are no Pokemon that match your search.',
            offset: 0,
            limit: limit,
            total: 0
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};
