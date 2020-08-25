const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class AbilityCtx {
     // return specified Ability (or return all Abilitys if no name supplied)
     async getAbility(name) {
        let query = name ? 
            'MATCH (a:Ability {name: $name}) RETURN a'
            : 'MATCH (a:Ability) RETURN a';
        let params = { name: name ? name : null };
        let ability = await utilities.queryNeo4j(query, params);

        if (Array.isArray(ability) && ability.length === 0) {
            return null;
        }
        
        return ability;
    }

    async createAbility(data) {
        let query = 'CREATE(a:Ability {name: $name, effect: $effect}) RETURN a';
        let params = {
            name: data.name,
            effect: data.effect
        };
        return await utilities.queryNeo4j(query, params);
    }

    async createPokeapiAbilities() {
        const abilityInitUrl = 'https://pokeapi.co/api/v2/ability?offset=0&limit=1000';  // 233 abilities in main series up to gen 7
        let abilityUrls = [];

        abilityUrls = await fetch(abilityInitUrl)
            .then(response => { return response.json() })
            .then(json => { return json.results.map(a => {
                    return a.url;
                })
            })
            .catch(err => console.log(err.message));
        
        Promise.all(await abilityUrls.forEach(async url =>
            await fetch(url) 
                .then(response => { return response.json() })
                .then(json => {
                    if (json.is_main_series) {
                        this.createAbility({
                            name: json.name,
                            effect: json.effect_entries.filter(e => e.language.name === 'en')[0].effect
                        })
                    }
                })
        ))
        .catch(err => console.log(err.message));
    }
}

module.exports = new AbilityCtx;