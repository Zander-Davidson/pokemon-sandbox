const { queryNeo4j } = require("../utilities/utilities");
const { moveModel } = require("./models/returnModels");
const fetch = require("node-fetch");

// TODO: figure out if I want to use models for moves
// return specified Move (or return all Moves if no name supplied)
const getMove = async (params) => {
    let model = moveModel(['m.', 't.', 'dc.']);
    let query = `
            MATCH (m:Move) ${params.name ? 'WHERE m.name = $name' : ''}
            WITH m
            MATCH (m)-[ht:HAS_TYPE]->(t) 
            WITH m, {name: t.name, color: t.color} AS t
            MATCH (m)-[hdc:HAS_DAMAGE_CLASS]->(dc)
            WITH m, t, dc
            RETURN ${model}
        `;
    return await queryNeo4j(query, params);
};

const getMovesByType = async (params) => {
    let model = moveModel(['m.', 't.', 'dc.']);
    let query = `
            MATCH (m:Move)
            WITH m
            MATCH (m)-[ht:HAS_TYPE]->(t:Type {name: $typeName}) 
            WITH m, {name: t.name, color: t.color} AS t
            MATCH (m)-[hdc:HAS_DAMAGE_CLASS]->(dc)
            WITH m, t, dc
            RETURN ${model}
        `;
    return await queryNeo4j(query, params);
};

const createMove = async (params) => {
    let mergeModel = moveModel(['$', null, null]);
    let returnModel = moveModel(['m.', null, null]);
    let query = `
            MATCH(dc:DamageClass {name: $damage_class})
            MATCH(t:Type {name: $type})
            MERGE(m:Move ${mergeModel})            
            MERGE (m)-[:HAS_DAMAGE_CLASS]->(dc)
            MERGE (m)-[:HAS_TYPE]->(t)
            RETURN ${returnModel}
        `;
    return await queryNeo4j(query, params);
};

const createPokeapiMoves = async () => {
    const moveInitUrl = 'https://pokeapi.co/api/v2/move?offset=0&limit=728';
    let moveUrls = [];

    moveUrls = await fetch(moveInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(m => {
                return m.url;
            })
        })
        .catch(err => console.log(err.message));

    Promise.all(await moveUrls.forEach(async url =>
        await fetch(url)
            .then(async response => { return await response.json() })
            .then(async json => {
                let effect = json.effect_entries.filter(e => e.language.name === 'en')[0].effect;

                let moveData = {
                    game_id: json.id,
                    name: json.name,
                    type: json.type.name,
                    effect_chance: json.effect_chance ? json.effect_chance : -1,
                    effect: effect ? effect : '',
                    damage_class: json.damage_class.name,
                    accuracy: json.accuracy ? json.accuracy : -1,
                    power: json.power ? json.power : -1,
                    priority: json.priority,
                    pp: json.pp,
                    target: json.target.name,
                };
                return await this.createMove(await moveData);
            })
    ))
        .catch(err => console.log(err.message));
};

const moveCtx = {
    getMove: getMove,
    getMovesByType: getMovesByType,
    createMove: createMove
};

module.exports = moveCtx;
