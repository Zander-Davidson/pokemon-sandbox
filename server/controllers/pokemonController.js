const pokemonCtx = require("../contexts/pokemonCtx");

exports.getPokemon = async (req, res) => {
    let params = {
        // required
        offset: req.params.offset,
        limit: req.params.limit,

        // optional
        sortOrder: req.body.sortOrder ? req.body.sortOrder : null, // 'asc' or 'desc'

        // optional (only 1 sort allowed)
        sortDexNo: req.body.sortDexNo ? req.body.sortDexNo : null, // boolean
        sortName: req.body.sortName ? req.body.sortName : null, // boolean
        sortStat: req.body.sortStat ? req.body.sortStat : null, // 'hp', 'atk', 'def', 'spa', 'spd', 'spe'

        // optional (any/all filters allowed)
        filterNames: req.body.filterNames ? req.body.filterNames : null, // string []
        filterMoves: req.body.filterMoves ? req.body.filterMoves : null, // string []
        filterTypes: req.body.filterTypes ? req.body.filterTypes : null, // string []
        filterAbilities: req.body.filterAbilities ? req.body.filterAbilities : null // string []
    };

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