const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class MoveCtx {
     // return specified Move (or return all Moves if no name supplied)
     async getMove(name) {
        let query = name ? 
            'MATCH (m:Move {name: $name}) RETURN m'
            : 'MATCH (m:Move) RETURN m';
        let params = { name: name ? name : null };
        let move = await utilities.queryNeo4j(query, params);

        if (Array.isArray(move) && move.length === 0) {
            return null;
        }
        
        return move;
    }

    async getMovesByType(typeName) {
        let query = `MATCH (m:Move)-[:HAS_TYPE]->(t:Type {name: $typeName}) RETURN m`;
        let params = { typeName: typeName};
        return await utilities.queryNeo4j(query, params);
    }

    async createMove(data) {
        let query = `
            MATCH(dc:DamageClass {name: $damage_class})
            MATCH(t:Type {name: $type})

            MERGE(m:Move {
                game_id: $game_id,
                name: $name,
                effect_chance: $effect_chance,
                effect: $effect,
                accuracy: $accuracy,
                power: $power,
                priority: $priority,
                pp: $pp,
                target: $target
            }) 
            
            MERGE (m)-[:HAS_DAMAGE_CLASS]->(dc)
            MERGE (m)-[:HAS_TYPE]->(t)

            RETURN m
        `;
        return await utilities.queryNeo4j(query, data);
    }

    async createPokeapiMoves() {
        const moveInitUrl = 'https://pokeapi.co/api/v2/move?offset=0&limit=3000';
        let moveUrls = [];

        moveUrls = await fetch(moveInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(m => {
                    return m.url;
                })
            })
            .catch(err => console.log(err.message));
        
        Promise.all(await moveUrls.forEach(async url =>
            await fetch(url) 
                .then(async response => { return await response.json() })
                .then(async json => {
                    let moveData = {
                        game_id: json.id,
                        name: json.name,
                        type: json.type.name,
                        effect_chance: json.effect_chance ? json.effect_chance : -1,
                        effect: json.effect_entries.filter(e => e.language.name === 'en')[0].effect,
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
    }
}

module.exports = new MoveCtx;