const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class PokemonCtx {
     // return specified Pokemon (or return all Pokemons if no name supplied)
     async getPokemon(name) {
        let query = name ? 
            'MATCH (p:Pokemon {name: $name}) RETURN p'
            : 'MATCH (p:Pokemon) RETURN p';
        let params = { name: name ? name : null };
        let pokemon = await utilities.queryNeo4j(query, params);

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

    async createPokeapiPokemons() {
        const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=3000';
        let pokemonUrls = [];

        pokemonUrls = await fetch(pokemonInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(p => {
                    return p.url;
                })
            })
            .catch(err => console.log(err.message));
        
        Promise.all(await pokemonUrls.forEach(async url =>
            await fetch(url) 
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
                        sprite_link: json.sprites.front_default ? json.sprites.front_default : '',
                        height: json.height,
                        weight: json.weight
                    };
                    return await this.createPokemon(await pokemonData);
                })
        ))
        .catch(err => console.log(err.message));
    }
}

module.exports = new PokemonCtx;