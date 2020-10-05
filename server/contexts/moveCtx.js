const { queryNeo4j } = require("../utilities/utilities");
const { moveModel } = require("./models/returnModels");
const fetch = require("node-fetch");

// return array of all move names
const getMoveNames = async () => {
    let query = `MATCH(m:Move) RETURN collect(m.name)`;
    let moveNames = await queryNeo4j(query);
    return moveNames[0];
}

// return array of all damage class names
const getDamageClassNames = async () => {
    let query = `MATCH(dc:DamageClass) RETURN collect(dc.name)`;
    let damageClassNames = await queryNeo4j(query);
    return damageClassNames[0];
}

// for more details see pokemonCtx.getPokemon()
/* params: {
    offset: <number>,  
    limit: <number>,   
    sortOrder: <string>,         ('asc' or 'desc')
    sortBy: <string>,            ('game_id', 'name', 'power', 'accuracy', 'priority', 'pp')
    hasNames: [<string>],        (include Moves with ANY name in this list)
    hasTypes: [<string>],        (include Moves with ANY type in this list)
    hasDamageClass: [<string>],  (include Moves with ANY dc in this list)
    hasPokemon: [<string>],      (include only moves learned by Pokemon in this list)
    strictPokemon: <boolean>     (if true, include only the common Moves learned by the Pokemon in this list)
} */
const getMoves = async (params) => {
    console.log(params)
    let offset = params.offset ? params.offset : 0;
    let limit = params.limit ? params.limit : 50;

    let strictPokemon = params.strictPokemon !== undefined ? params.strictPokemon : false;

    // determine sorting order ASC (default) or DESC
    let sortOrder = '';
    if (!params.sortOrder || params.sortOrder === "asc") { sortOrder = " ASC "; }
    else { sortOrder = " DESC "; }

    // determine any criteria to sort by
    let sortBy = '';
    switch (params.sortBy) {
        case 'name': sortBy = ` ORDER BY m.name `; break;
        case 'power': sortBy = ` ORDER BY m.power IS NOT NULL DESC, m.power `; break;
        case 'accuracy': sortBy = ` ORDER BY m.accuracy IS NOT NULL DESC, m.accuracy `; break;
        case 'priority': sortBy = ` ORDER BY m.priority IS NOT NULL DESC, m.priority `; break;
        case 'pp': sortBy = ` ORDER BY m.pp IS NOT NULL DESC, m.pp `; break;
        default: sortBy = ` ORDER BY m.game_id `; break;
    }

    sortBy += sortOrder;

    let filterQuery = `
            MATCH (m:Move) 
            ${params.hasNames && params.hasNames.length > 0 ? 'WHERE m.name IN $hasNames' : ''}
            WITH m

            ${params.hasDamageClass && params.hasDamageClass.length > 0 ? `
                MATCH (m)-[hdc:HAS_DAMAGE_CLASS]->(dc)
                WHERE dc.name IN $hasDamageClass
                WITH m
            ` : ''}

            ${params.hasTypes && params.hasTypes.length > 0 ? `
                MATCH (m)-[ht:HAS_TYPE]->(t:Type)
                WHERE t.name IN $hasTypes
                WITH m
            `: ''}

            ${params.hasPokemon && params.hasPokemon.length > 0 ? `
                ${strictPokemon ? `
                    MATCH (m)<-[:HAS_MOVE]-(p:Pokemon)
                    WHERE p.name in $hasPokemon
                    WITH m, size($hasPokemon) AS inputCnt, COUNT(DISTINCT p) AS cnt
                    WHERE cnt = inputCnt
                    WITH m
                ` : `
                    MATCH (m)<-[:HAS_MOVE]-(p:Pokemon)
                    WHERE p.name IN $hasPokemon
                    WITH m
                `}
            ` : ''}
            
            RETURN {
                total: COUNT(DISTINCT m),
                moveNames: COLLECT(DISTINCT m.name)
            }
    `;

    let dataQuery = `
            MATCH (m:Move)
            WHERE m.name IN $moveNames
            WITH m
            MATCH (m)-[ht:HAS_TYPE]->(t)
            WITH m, {name: t.name, color: t.color} AS t
            MATCH (m)-[hdc:HAS_DAMAGE_CLASS]->(dc)
            WITH m, t, dc

            ${sortBy}
            SKIP ${offset}
            LIMIT ${limit}

            RETURN {
                game_id: m.game_id,
                name: m.name,
                effect_chance: m.effect_chance,
                effect: m.effect,
                accuracy: m.accuracy,
                power: m.power,
                priority: m.priority,
                pp: m.pp,
                target: m.target,
                type: {
                    name: t.name,
                    color: t.color
                },
                damage_class: dc.name
            }
        `;

    let filterResults = await queryNeo4j(filterQuery, params);
    let moveResults = await queryNeo4j(dataQuery, filterResults[0]);

    return {
        offset: offset,
        limit: limit,
        total: filterResults[0].total,
        names: filterResults[0].moveNames,
        moves: moveResults
    };
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
    getDamageClassNames,
    getMoveNames,
    getMoves,
    getMovesByType,
    createMove
};

module.exports = moveCtx;
