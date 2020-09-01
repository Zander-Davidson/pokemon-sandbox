const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class PokemonCtx {
     // return specified Pokemon (or return all Pokemons if no name supplied)
     async getPokemon(name) {
        let query = name ? `
            MATCH (p:Pokemon) WHERE p.name = $name
            WITH p
            MATCH (p)-[ht:HAS_TYPE]->(t) WITH p, ht, t ORDER BY ht.slot
            WITH p, COLLECT({slot: ht.slot, name: t.name, color: t.color}) AS types
            MATCH (p)-[ha:HAS_ABILITY]->(a) WITH p, types, ha, a ORDER BY ha.slot
            WITH p, types, COLLECT({slot: ha.slot, name: a.name, is_hidden: ha.is_hidden}) AS abilities
            MATCH (p)-[hs:HAS_STAT]->(s) WITH p, types, abilities, hs, s ORDER BY s.order
            WITH p, types, abilities, COLLECT({name: s.name, value: hs.value}) AS stats
            MATCH (p)-[hm:HAS_MOVE]->(m) WITH m, p, types, abilities, stats ORDER BY m.name
            WITH p, types, abilities, stats, COLLECT({name: m.name}) AS moves

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
            }`
            : `MATCH (p:Pokemon)
            WITH p ORDER BY p.game_id
            MATCH (p)-[ht:HAS_TYPE]->(t) WITH p, ht, t ORDER BY ht.slot
            WITH p, COLLECT({slot: ht.slot, name: t.name, color: t.color}) AS types
            MATCH (p)-[ha:HAS_ABILITY]->(a) WITH p, types, ha, a ORDER BY ha.slot
            WITH p, types, COLLECT({slot: ha.slot, name: a.name, is_hidden: ha.is_hidden}) AS abilities
            MATCH (p)-[hs:HAS_STAT]->(s) WITH p, types, abilities, hs, s ORDER BY s.order
            WITH p, types, abilities, COLLECT({name: s.name, value: hs.value}) AS stats

            RETURN {
                game_id: p.game_id,
                name: p.name,
                sprite_link: p.sprite_link,
                height: p.height,
                weight: p.weight,
                types: types,
                abilities: abilities,
                stats: stats
            }`;

        let params = { name: name ? name : null };
        let formatter = (records) => {
            let formattedRecords = records.map(r => {
                return r._fields[0];
            });
            return formattedRecords.length > 1 ? formattedRecords : formattedRecords[0];
        };
        let pokemon = await utilities.queryNeo4j(query, params, formatter);

        if (Array.isArray(pokemon) && pokemon.length === 0) {
            return null;
        }
        
        return pokemon;
    }

    // async getPokemonsByType(typeName) {
    //     let query = `MATCH (p:Pokemon)-[:HAS_TYPE]->(t:Type {name: $typeName}) RETURN p`;
    //     let params = { typeName: typeName};
    //     return await utilities.queryNeo4j(query, params);
    // }

    
    async createPokemon(data) {
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

            RETURN p
        `;
        return await utilities.queryNeo4j(query, data);
    }

    async createPokeapiPokemons(offset, limit) {
        const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=' + limit;
        let pokemonUrls = [];

        pokemonUrls = await fetch(pokemonInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(p => {
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
    }


    /* data = {[
        {
            name: <string>,
            evolves_from: null OR {name: <string>},
            evolves_to: null OR [{name: <string>}, ...]
        }, ...
    ]} */
    async createPokemonEvolution(data) {
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

        return await utilities.queryNeo4j(query, data);
    }

    async createPokeapiEvolutions(offset, limit) {
        const evolutionInitUrl = 'https://pokeapi.co/api/v2/evolution-chain?offset=0&limit=3000';
        let evolutionUrls = [];

        evolutionUrls = await fetch(evolutionInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(e => {
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
                                    evolves_from: evolvesFrom ? {name: evolvesFrom} : null,
                                    evolves_to: e.evolves_to.length > 0 ? e.evolves_to.map(et => {return {name: et.species.name}}) : null
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
    }


    /* data = {
        name: <string>,
        official_artwork_link: <string>
    } */
    async createOfficialArtwork(data) {
        let query = `
            MATCH (p:Pokemon {name: $name})
            SET p.official_artwork_link = $official_artwork_link
            RETURN p.official_artwork_link
        `;
        return await utilities.queryNeo4j(query, data, () => {});
    }

    async createPokeapiOfficialArtwork(offset, limit) {
        const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=' + limit; // 200 safe limit
        let pokemonUrls = [];

        pokemonUrls = await fetch(pokemonInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(p => {
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
    }
}

module.exports = new PokemonCtx;