const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class ItemCtx {
     // return specified Item (or return all Items if no name supplied)
     async getItem(name) {
        let query = name ? 
            'MATCH (m:Item {name: $name}) RETURN m'
            : 'MATCH (m:Item) RETURN m';
        let params = { name: name ? name : null };
        let item = await utilities.queryNeo4j(query, params);

        if (Array.isArray(item) && item.length === 0) {
            return null;
        }
        
        return item;
    }

    async createItem(data) {
        let query = `
            MERGE(i:Item {
                game_id: $game_id,
                name: $name,
                effect: $effect,
                fling_effect: $fling_effect,
                fling_power: $fling_power,
                sprite_link: $sprite_link
            }) RETURN i
        `;
        return await utilities.queryNeo4j(query, data);
    }

    async createPokeapiItems() {
        const itemInitUrl = 'https://pokeapi.co/api/v2/item?offset=699&limit=300';
        let itemUrls = [];

        itemUrls = await fetch(itemInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(i => {
                    return i.url;
                })
            })
            .catch(err => console.log(err.message));
        
        Promise.all(await itemUrls.forEach(async url =>
            await fetch(url) 
                .then(response => { return response.json() })
                .then(json => {
                    let itemData = {
                        game_id: json.id,
                        name: json.name,
                        effect: json.effect_entries[0].effect,
                        fling_effect: typeof json.fling_effect === 'undefined' || json.fling_effect === null || json.fling_effect.name === null ? '' : json.fling_effect.name,
                        fling_power: typeof json.fling_power === 'undefined' || json.fling_power === null ? '' : json.fling_power,
                        sprite_link: typeof json.sprites.default !== 'undefined' && json.sprites.default !== null ? json.sprites.default : '',
                    };
                    this.createItem(itemData);
                })
        ))
        .catch(err => console.log(err.message));
    }
}

module.exports = new ItemCtx;