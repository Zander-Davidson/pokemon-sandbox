const { queryNeo4j } = require("../utilities/utilities");
const { itemModel } = require("./models/returnModels");
const fetch = require("node-fetch");

// return specified Item (or return all Items if no name supplied)
const getItem = async (params) => {
    let model = itemModel(['i.']);
    let query = `MATCH (i:Item) ${params.name ? 'WHERE i.name = $name' : ''} RETURN ${model}`;
    return await queryNeo4j(query, params);
};

const createItem = async (params) =>  {
    let mergeModel = itemModel(['$']);
    let returnModel = itemModel(['i.']);
    let query = `MERGE(i:Item ${mergeModel}) RETURN ${returnModel}`;
    return await queryNeo4j(query, params);
};

const createPokeapiItems = async () => {
    const itemInitUrl = 'https://pokeapi.co/api/v2/item?offset=0&limit=3000';
    let itemUrls = [];

    itemUrls = await fetch(itemInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(i => {
                return i.url;
            })
        })
        .catch(err => console.log(err.message));

    Promise.all(await itemUrls.forEach(async url =>
        await fetch(url)
            .then(async response => { return await response.json() })
            .then(async json => {
                let itemData = {
                    game_id: json.id,
                    name: json.name,
                    effect: json.effect_entries.filter(e => e.language.name === 'en')[0].effect,
                    fling_effect: typeof json.fling_effect === 'undefined' || json.fling_effect === null || json.fling_effect.name === null ? '' : json.fling_effect.name,
                    fling_power: typeof json.fling_power === 'undefined' || json.fling_power === null ? '' : json.fling_power,
                    sprite_link: typeof json.sprites.default !== 'undefined' && json.sprites.default !== null ? json.sprites.default : '',
                };
                return await this.createItem(await itemData);
            })
    ))
        .catch(err => console.log(err.message));
};

const itemCtx = {
    getItem: getItem,
    createItem: createItem
};

module.exports = itemCtx;
