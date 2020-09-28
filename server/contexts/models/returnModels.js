const userModel = ([userAlias]) => {
    return `{
        username: ${userAlias}username,
        email: ${userAlias}email,
        created_at: ${userAlias}created_at
    }`
}

const abilityModel = ([abilityAlias]) => {
    return `{
        name: ${abilityAlias}name,
        effect: ${abilityAlias}effect
    }`;
};

const itemModel = ([itemAlias]) => {
    return `{
        game_id: ${itemAlias}game_id,
        name: ${itemAlias}name,
        effect: ${itemAlias}effect,
        fling_effect: ${itemAlias}fling_effect,
        fling_power: ${itemAlias}fling_power,
        sprite_link: ${itemAlias}sprite_link
    }`;
};

const moveModel = ([moveAlias, typeAlias, damageClassAlias]) => {
    return `{
        game_id: ${moveAlias}game_id,
        name: ${moveAlias}name,
        effect_chance: ${moveAlias}effect_chance,
        effect: ${moveAlias}effect,
        accuracy: ${moveAlias}accuracy,
        power: ${moveAlias}power,
        priority: ${moveAlias}priority,
        pp: ${moveAlias}pp,
        target: ${moveAlias}target
        ${typeAlias ? 
        `, type: {
            name: ${typeAlias}name,
            color: ${typeAlias}color
        }`   
        : ''}        
        ${damageClassAlias ? `, damage_class: ${damageClassAlias}name` : ''}
    }`    
} 

const pokemonModel = ([pokemonAlias, typesAlias, movesAlias, abilitiesAlias, statsAlias]) => {
    return `{
        game_id: ${pokemonAlias}game_id,
        name: ${pokemonAlias}name,
        sprite_link: ${pokemonAlias}sprite_link,
        height: ${pokemonAlias}height,
        weight: ${pokemonAlias}weight
        ${typesAlias ? `, types: ${typesAlias}` : ''}
        ${movesAlias ? `, moves: ${movesAlias}` : ''}
        ${abilitiesAlias ? `, abilities: ${abilitiesAlias}` : ''}
        ${statsAlias ? `, stats: ${statsAlias}` : ''}
    }`
}

const typeModel = ([typeAlias]) => {
    return `{
        color: ${typeAlias}color,
        name: ${typeAlias}name
    }`
}

module.exports = {
    userModel: userModel,
    abilityModel: abilityModel,
    itemModel: itemModel,
    moveModel: moveModel,
    pokemonModel: pokemonModel,
    typeModel: typeModel
}

