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

    async createMove(data) {
        let query = `
            CREATE(m:Move {
                name: $name,
                type: $type,
                effectChance: $effectChance,
                effect: $effect,
                damageClass: $damageClass,
                accuracy: $accuracy,
                power: $power,
                priority: $priority,
                pp: $pp
            }) RETURN m
        `;
        return await utilities.queryNeo4j(query, data);
    }

    async createPokeapiMoves() {
        const moveInitUrl = 'https://pokeapi.co/api/v2/move?offset=0&limit=728'; // 728 moves in main series to gen 7
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
                        name: json.name,
                        type: json.type.name,
                        effectChance: json.effect_chance,
                        effect: json.effect_entries[0].effect,
                        damageClass: json.damage_class.name,
                        accuracy: json.accuracy,
                        power: json.power,
                        priority: json.priority,
                        pp: json.pp,
                    })
                })
        ))
        .catch(err => console.log(err.message));
    }
}

module.exports = new MoveCtx;