const express = require('express');
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

router.get(
    '/:offset/:limit',
    pokemonController.getPokemon
);

// router.get(
//    '/bytype/:type1Name/:type2Name?'
// );

module.exports = router;

// "sortOrder":
// "sortDexNo":
// "sortName":
// "sortStat":
// "filterNames":
// "filterMoves":
// "filterTypes":
// "filterAbilities":