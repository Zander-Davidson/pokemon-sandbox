const { queryNeo4j } = require("../utilities/utilities");
const { abilityModel } = require("./models/returnModels");
const fetch = require("node-fetch");

// return array of all ability names
const getAbilityNames = async () => {
    let query = `MATCH(a:Ability) RETURN collect(a.name)`;
    let abilityNames = await queryNeo4j(query);
    return abilityNames[0];
}

// return specified Ability (or return all Abilitys if no name supplied)
/* params = {
    name: <string>
}*/
const getAbility = async (params) => {
    let model = abilityModel(['a.']);
    let query = `MATCH (a:Ability) ${params.name ? 'WHERE a.name = $name' : ''} RETURN ${model}`;
    return await queryNeo4j(query, params);
}

const createAbility = async (params) => {
    let mergeModel = abilityModel(['$']);
    let returnModel = abilityModel(['a.']);
    let query = `MERGE(a:Ability ${mergeModel}) RETURN ${returnModel}`;
    return await queryNeo4j(query, params);
}

const createPokeapiAbilities = async () => {
    const abilityInitUrl = 'https://pokeapi.co/api/v2/ability?offset=0&limit=1000';  // 233 abilities in main series up to gen 7
    let abilityUrls = [];

    abilityUrls = await fetch(abilityInitUrl)
        .then(response => { return response.json() })
        .then(json => {
            return json.results.map(a => {
                return a.url;
            })
        })
        .catch(err => console.log(err.message));

    Promise.all(await abilityUrls.forEach(async url =>
        await fetch(url)
            .then(async response => { return await response.json() })
            .then(async json => {
                if (json.is_main_series) {
                    let abilityData = {
                        name: json.name,
                        effect: json.effect_entries.filter(e => e.language.name === 'en')[0].effect
                    };
                    return await this.createAbility(await abilityData);
                }
            })
    ))
        .catch(err => console.log(err.message));
}


const abilityCtx = {
    getAbilityNames,
    getAbility,
    createAbility
};

module.exports = abilityCtx;
