const { queryNeo4j } = require("../utilities/utilities");
const { pokemonModel } = require("./models/returnModels");
const fetch = require("node-fetch");

// Returns a list of pokemon and their attributes (stats, all moves learned, abilities, types, etc.).
// no params are required, and all null params are handled. If all params are null, return the first
// 50 pokemon sorted by game_id ASC.
// TODO: filter by mono/dual type
/* params: {
    offset: <number>,  
    limit: <number>,   
    sortOrder: <string>,       ('asc' or 'desc')
    sortBy: <string>,          ('game_id', 'name', 'hp', 'atk', 'def', 'spa', 'spd', 'spe')
    hasNames: [<string>],      (include Pokemon with ANY name in this list)
    hasTypes: [<string>],      (include Pokemon with types in this list)
    strictTypes: <boolean>     (if true, include Pokemon having ALL types in hasTypes. false by default)
    hasAbilities: [<string>],  (include Pokemon with ANY ability in this list)
    hasMoves: [<string>],      (include Pokemon that learn moves in this list)
    strictMoves: <boolean>     (if true, include Pokemon having ALL moves in includemoves. true by default)
} */
const getPokemon = async (params) => {
    let offset = params.offset ? params.offset : 0;
    let limit = params.limit ? params.limit : 50;

    let strictTypes = params.strictTypes !== undefined ? params.strictTypes : false;
    let strictMoves = params.strictMoves !== undefined ? params.strictMoves : true;

    let monotype = params.monotype !== undefined ? params.monotype : undefined;

    // determine sorting order ASC (default) or DESC
    let sortOrder = '';
    if (!params.sortOrder || params.sortOrder === "asc") { sortOrder = " ASC "; }
    else { sortOrder = " DESC "; }

    // determine any criteria to sort by
    let sortBy = '';
    switch (params.sortBy) {
        case 'name': sortBy = ` ORDER BY p.name `; break;
        case 'hp': sortBy = ` ORDER BY stats[0].value `; break;
        case 'atk': sortBy = ` ORDER BY stats[1].value `; break;
        case 'def': sortBy = ` ORDER BY stats[2].value `; break;
        case 'spa': sortBy = ` ORDER BY stats[3].value `; break;
        case 'spd': sortBy = ` ORDER BY stats[4].value `; break;
        case 'spe': sortBy = ` ORDER BY stats[5].value `; break;
        default: sortBy = ` ORDER BY p.game_id `; break;
    }

    sortBy += sortOrder;

    // this query filters out pokemon by the parameters supplied. it returns the number of matches 
    // (total) and the names of the pokemon that matched (names). These will be fed to the data 
    // query so that it can focus on aggregating moves/types/abilities instead of filtering
    let filterQuery = `
            MATCH (p:Pokemon)
            ${params.hasNames ? 'WHERE p.name IN $hasNames' : ' '}
            WITH p

            ${params.hasTypes ? `
                ${strictTypes ? `
                    MATCH (p)-[ht:HAS_TYPE]->(t:Type)
                    WHERE t.name in $hasTypes
                    WITH p, size($hasTypes) AS inputCnt, COUNT(DISTINCT t) AS cnt  //, COUNT(distinct ht) AS typeCnt
                    WHERE cnt = inputCnt //${monotype !== undefined ? `${monotype ? ' AND cnt = 1' : ' AND cnt = 2'}` : ''}
                    WITH p
                ` : `
                    MATCH (p)-[ht:HAS_TYPE]->(t:Type)
                    WITH p, t   //, COUNT(distinct t) AS cnt, COUNT(distinct ht) as hcnt
                    WHERE t.name IN $hasTypes //${monotype !== undefined ? `${monotype ? ' AND cnt = 1' : ' AND cnt = 2'}` : ''}
                    WITH p
                `}
            ` : ''}

            ${params.hasAbilities ? `
                MATCH (p)-[:HAS_ABILITY]->(a:Ability)
                WHERE a.name IN $hasAbilities
                WITH p
            ` : ' '}

            ${params.hasMoves ? `
                ${strictMoves ? `
                    MATCH (p)-[:HAS_MOVE]->(m:Move)
                    WHERE m.name in $hasMoves
                    WITH p, size($hasMoves) AS inputCnt, COUNT(DISTINCT m) AS cnt
                    WHERE cnt = inputCnt
                    WITH p
                ` : `
                    MATCH (p)-[:HAS_MOVE]->(m:Move)
                    WHERE m.name IN $hasMoves
                    WITH p
                `}
            ` : ''}
            
            RETURN {
                total: COUNT(DISTINCT p),
                pokemonNames: COLLECT(DISTINCT p.name)
            }
    `;

    // this query aggregates the types, abilites, moves, and stats of the pokemon found in 
    // the previous query. I first tried combining filtering and aggregating, but was having
    // problems with intersection: getPokemon() needs to return a list of pokemon who learn
    // ALL of the moves provided in the params, but need only satisfy have one match from each 
    // of ability and type.
    let dataQuery = `
            MATCH (p:Pokemon)
            WHERE p.name IN $pokemonNames
            WITH p

            MATCH (p)-[ht:HAS_TYPE]->(t)
            WITH p, ht, t ORDER BY ht.slot
            WITH p, COLLECT({slot: ht.slot, name: t.name, color: t.color}) AS types

            MATCH (p)-[ha:HAS_ABILITY]->(a)
            WITH p, types, ha, a ORDER BY ha.slot
            WITH p, types, COLLECT({slot: ha.slot, name: a.name, is_hidden: ha.is_hidden}) AS abilities

            MATCH (p)-[hs:HAS_STAT]->(s) WITH p, types, abilities, hs, s ORDER BY s.order
            WITH p, types, abilities, COLLECT({name: s.name, value: hs.value}) AS stats

            MATCH (p)-[hm:HAS_MOVE]->(m) 
            WITH m, p, types, abilities, stats 
            WITH p, types, abilities, stats, COLLECT(m.name) AS moves

            ${sortBy}
            SKIP ${offset}
            LIMIT ${limit}

            RETURN {
                game_id: p.game_id,
                name: p.name,
                sprite_link: p.sprite_link,
                height: p.height,
                weight: p.weight,
                types: types,
                moves: moves,
                abilities: abilities,
                stats: stats
            };
    `;

    let filterResults = await queryNeo4j(filterQuery, params);
    let pokemonResults = await queryNeo4j(dataQuery, filterResults[0]);

    return {
        offset: offset,
        limit: limit,
        total: filterResults[0].total,
        names: filterResults[0].pokemonNames,
        pokemon: pokemonResults
    };
};

// async getPokemonByType(params) {
//     let model = pokemonModel(['p.', 'types', 'moves', 'abilities', 'stats']);
//     let query = `
//         MATCH (p:Pokemon)-[ht:HAS_TYPE]->(t:Type)
//         WHERE             
//         ${params.type2Name ? 
//             't.name = $type1Name OR t.name = $type2Name'
//             : 't.name = $type1Name '}
//         WITH p, ht, t ORDER BY ht.slot
//         WITH p, COLLECT({slot: ht.slot, name: t.name, color: t.color}) AS types
//         MATCH (p)-[ha:HAS_ABILITY]->(a) WITH p, types, ha, a ORDER BY ha.slot
//         WITH p, types, COLLECT({slot: ha.slot, name: a.name, is_hidden: ha.is_hidden}) AS abilities
//         MATCH (p)-[hs:HAS_STAT]->(s) WITH p, types, abilities, hs, s ORDER BY s.order
//         WITH p, types, abilities, COLLECT({name: s.name, value: hs.value}) AS stats
//         MATCH (p)-[hm:HAS_MOVE]->(m) WITH m, p, types, abilities, stats ORDER BY m.name
//         WITH p, types, abilities, stats, COLLECT({name: m.name}) AS moves
//         RETURN ${model}`;
//     return await queryNeo4j(query, params);
// }


const createPokemon = async (params) => {
    let model = pokemonModel(['p.', null, null, null, null]);
    let query = `
            UNWIND $stats AS sMap
            UNWIND $types AS tMap
            UNWIND $abilities AS aMap
            UNWIND $moves AS mMap

            MATCH 
                (s:Stat {name: sMap.name}),
                (t:Type {name: tMap.name}),
                (a:Ability {name: aMap.name}),
                (m:Move {name: mMap.name})

            MERGE (p:Pokemon {
                game_id: $game_id,
                name: $name,
                sprite_link: $sprite_link,
                official_artwork_link: $official_artwork_link,
                height: $height,
                weight: $weight
            })        
            
            MERGE (p)-[:HAS_STAT {value: sMap.value}]->(s)  
            MERGE (p)-[:HAS_TYPE {slot: tMap.slot}]->(t)
            MERGE (p)-[:HAS_ABILITY {slot: aMap.slot, is_hidden: aMap.is_hidden}]->(a)
            MERGE (p)-[:HAS_MOVE]->(m)

            RETURN ${model}
        `;
    return await queryNeo4j(query, params);
};

const createPokeapiPokemons = async (offset, limit) => {
    const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=' + limit;
    let pokemonUrls = [];

    pokemonUrls = await fetch(pokemonInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(p => {
                return p.url;
            })
        })
        .catch(err => console.log(err.message));

    await pokemonUrls.reduce(async (promise, url, index) => {
        await promise.then(
            fetch(url)
                .then(async response => { return await response.json() })
                .then(async json => {

                    let pokemonData = {
                        game_id: json.id,
                        name: json.name,
                        types: json.types.map(t => {
                            return {
                                slot: t.slot,
                                name: t.type.name,
                            }
                        }),
                        abilities: json.abilities.map(a => {
                            return {
                                slot: a.slot,
                                name: a.ability.name,
                                is_hidden: a.is_hidden
                            }
                        }),
                        moves: json.moves.map(m => {
                            return {
                                name: m.move.name
                            }
                        }),
                        stats: json.stats.map(s => {
                            return {
                                name: s.stat.name,
                                value: s.base_stat
                            }
                        }),
                        sprite_link: json.sprites.front_default,
                        official_artwork_link: json.sprites.other['official-artwork'].front_default,
                        height: json.height,
                        weight: json.weight
                    };
                    return await this.createPokemon(await pokemonData);
                })
                .then(async node => console.log(await node))
        )
            .catch(err => console.log(err.message))
    }, Promise.resolve())
};

/* data = {
    name: <string>,
    official_artwork_link: <string>
} */
const createOfficialArtwork = async (data) => {
    let query = `
            MATCH (p:Pokemon {name: $name})
            SET p.official_artwork_link = $official_artwork_link
            RETURN p.official_artwork_link
        `;
    return await queryNeo4j(query, data, () => { });
};

/* data = {[
    {
        name: <string>,
        evolves_from: null OR {name: <string>},
        evolves_to: null OR [{name: <string>}, ...]
    }, ...
]} */
const createPokemonEvolution = async (params) => {
    let query = ``;

    // some pokemon don't evolve to/from anything
    if (data.evolves_to && data.evolves_from) {
        query = `
                UNWIND $evolves_to AS etMap 
                MATCH (p:Pokemon {name: $name}), (et:Pokemon {name: etMap.name}), (ef:Pokemon {name: $evolves_from.name})
                MERGE (p)-[:EVOLVES_TO]->(et)
                MERGE (p)-[:EVOLVES_FROM]->(ef)
                RETURN p`;
    } else if (data.evolves_to) {
        query = `
                UNWIND $evolves_to AS etMap 
                MATCH (p:Pokemon {name: $name}), (et:Pokemon {name: etMap.name})
                MERGE (p)-[:EVOLVES_TO]->(et)
                RETURN p`;
    } else if (data.evolves_from) {
        query = `
                MATCH (p:Pokemon {name: $name}), (ef:Pokemon {name: $evolves_from.name})
                MERGE (p)-[:EVOLVES_FROM]->(ef)
                RETURN p`;
    } else { return null; }

    return await queryNeo4j(query, data);
};

const createPokeapiEvolutions = async (offset, limit) => {
    const evolutionInitUrl = 'https://pokeapi.co/api/v2/evolution-chain?offset=0&limit=3000';
    let evolutionUrls = [];

    evolutionUrls = await fetch(evolutionInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(e => {
                return e.url;
            })
        })
        .catch(err => console.log(err.message));

    await evolutionUrls.reduce(async (promise, url) => {
        await promise.then(
            fetch(url)
                .then(async response => { return await response.json() })
                .then(async json => {
                    var evoData = [];

                    // collect data from nested evolution chain into a simple 2D array of evolutions by pokemon
                    function traverseEvoChain(evoChain, evolvesFrom) {
                        evoChain.forEach(e => {

                            evoData.push({
                                name: e.species.name,
                                evolves_from: evolvesFrom ? { name: evolvesFrom } : null,
                                evolves_to: e.evolves_to.length > 0 ? e.evolves_to.map(et => { return { name: et.species.name } }) : null
                            });

                            traverseEvoChain(e.evolves_to, e.species.name);
                        });
                    };

                    traverseEvoChain([json.chain]);
                    return evoData;
                })
                .then(async evoData => {
                    await evoData.reduce(async (promise, data) => {
                        await promise.then(await this.createPokemonEvolution(data));
                    }, Promise.resolve());
                })
        )
            .catch(err => console.log(err.message));
    }, Promise.resolve())
};

const createPokeapiOfficialArtwork = async (offset, limit) => {
    const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=' + limit; // 200 safe limit
    let pokemonUrls = [];

    pokemonUrls = await fetch(pokemonInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(p => {
                return p.url;
            })
        })
        .catch(err => console.log(err.message));

    await pokemonUrls.reduce(async (promise, url, index) => {
        await promise.then(
            fetch(url)
                .then(async response => { return await response.json() })
                .then(async json => {
                    console.log(json.sprites.other['official-artwork'].front_default)

                    let artworkData = {
                        name: json.name,
                        official_artwork_link: json.sprites.other['official-artwork'].front_default
                    };
                    return await this.createOfficialArtwork(await artworkData);
                })
        )
            .catch(err => console.log(err.message))
    }, Promise.resolve())
};

const pokemonCtx = {
    getPokemon,
    createPokemon,
    createOfficialArtwork,
    createPokemonEvolution
};

module.exports = pokemonCtx;
