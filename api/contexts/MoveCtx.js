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
            CREATE(m:Move {
                game_id: $game_id,
                name: $name,
                type: $type,
                effect_chance: $effect_chance,
                effect: $effect,
                damage_class: $damage_class,
                accuracy: $accuracy,
                power: $power,
                priority: $priority,
                pp: $pp,
                target: $target
            }) RETURN m
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
                .then(response => { return response.json() })
                .then(json => {
                    this.createMove({
                        game_id: json.id,
                        name: json.name,
                        type: json.type.name,
                        effect_chance: json.effect_chance,
                        effect: json.effect_entries[0].effect,
                        damage_class: json.damage_class.name,
                        accuracy: json.accuracy,
                        power: json.power,
                        priority: json.priority,
                        pp: json.pp,
                        target: json.target.name,
                    })
                })
        ))
        .catch(err => console.log(err.message));
    }
}

module.exports = new MoveCtx;