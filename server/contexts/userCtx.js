const { queryNeo4j } = require("../utilities/utilities");

const getTeamPreviews = async (params) => {
    let orderDir = '';
    if (params.orderDir && params.orderDir === "asc") { orderDir = " ASC "; }
    else { orderDir = " DESC "; }

    let orderBy = '';
    if (params.orderBy === 'name') { orderBy = 'name' }
    else if (params.orderBy === 'created_at') { orderBy = 'created_at' }
    else { orderBy = 'updated_at' }

    params = {
        user_id: Number(params.user_id)
    };

    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(t:UserTeam) WHERE id(u) = $user_id AND NOT EXISTS(t.deleted_at)
        WITH t
        OPTIONAL MATCH (t)-[hs:HAS_SET]->(s:UserSet)-[:IS_POKEMON]->(p:Pokemon) 
        WHERE NOT EXISTS(s.deleted_at)
        WITH t, s, hs, p
        ORDER BY t.${orderBy} ${orderDir}, hs.slot
        RETURN {
            team_id: id(t), 
            name: t.name,
            created_at: t.created_at,
            updated_at: t.updated_at,
            sets: CASE WHEN s IS NOT NULL THEN collect({set_id: id(s), slot: hs.slot, sprite_link: p.sprite_link})
                ELSE [] END
        }`;
    return await queryNeo4j(query, params);
};

/* params = {
    ser_id: <number>
    name: <string>
} */
const createTeam = async (params) => {
    let query = `
        MATCH (u:User) WHERE id(u) = $user_id
        MERGE (u)-[:HAS_TEAM]->(t:UserTeam {
            created_at: datetime(),
            updated_at: datetime(),
            name: $name
        })

        RETURN {
            team_id: id(t), 
            name: t.name,
            created_at: t.created_at,
            updated_at: t.updated_at,
            sets: []
        }
    `;
    return await queryNeo4j(query, params);
};

/* params: {
    user_id: <number>,
    team_id: <number>,
    name: <string>
} */
const updateTeam = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]-(t:UserTeam) 
        WHERE id(u) = $user_id AND id(t) = $team_id
        SET t.name = $name, t.updated_at = datetime()

        RETURN {
            team_id: id(t), 
            name: t.name
        }
    `;
    return await queryNeo4j(query, params);
};

/* params: {
    user_id: <number>,
    team_id: <number>
} */
const deleteTeam = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(t:UserTeam) 
        WHERE id(u) = $user_id AND id(t) = $team_id
        SET t.updated_at = datetime(), t.deleted_at = datetime()

        RETURN {
            team_id: id(t)
        }
    `;
    return await queryNeo4j(query, params);
};

/* params = {
    user_id: [number],
    team_id: [string],
    pokemon_slot: [number 1-6],
    pokemon_name: [string],
    nickname: [string],
    item_name: [string],
    level: [number],
    gender: [string],
    is_shiny: [boolean],
    ability_name: [string],
    nature_name: [string],
    stats: [{
        stat_name: [string],
        ivs: [number 0-31],
        evs: [number 0-252]
    }, ...],
    moves: [{
        move_slot: [number 1-4],
        move_name: [string]
    }, ...]
}*/
const createSet = async (params) => {
    // TODO: verify fields

    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(t:UserTeam)
        WHERE id(u) = $user_id AND id(t) = $team_id AND NOT EXISTS(t.deleted_at)
        WITH u, t
        OPTIONAL MATCH (t)-[:HAS_SET]->(set:UserSet)
        WHERE NOT EXISTS(set.deleted_at)
        WITH count(set) AS numSets
        CALL apoc.do.when(numSets < 6,
            'MATCH 
                (u:User)-[:HAS_TEAM]->(t:UserTeam),
                (p:Pokemon)-[ha:HAS_ABILITY]->(a:Ability),
                (p)-[ht:HAS_TYPE]->(tp:Type),
                (n:Nature)
            WHERE id(u) = $user_id AND id(t) = $team_id 
                AND p.name = $pokemon_name AND ha.slot = 1 AND n.name = "bashful"
            WITH u, t, a, n, p, collect({type_slot: ht.slot, type_name: tp.name, type_color: tp.color}) as type
            OPTIONAL MATCH (t)-[:HAS_SET]->(sets:UserSet)
            WITH u, t, a, n, p, type, count(sets) AS numSets
            MERGE 
                (t)-[hs:HAS_SET {
                    slot: numSets + 1
                }]->(newSet:UserSet {
                    created_at: datetime(),
                    updated_at: datetime(),
                    ivs: [31, 31, 31, 31, 31, 31],
                    evs: [0, 0, 0, 0, 0, 0]
                })-[ip:IS_POKEMON {
                    gender: "male",
                    is_shiny: false,
                    level: 100
                }]->(p)
            MERGE (newSet)-[:HAS_ABILITY]->(a)
            MERGE (newSet)-[:HAS_NATURE]->(n)
            RETURN t, u, hs, ip, a, n, newSet, p, type, false as isError',

            // else get the proper error
            'MATCH(error:Error {code: "ucs1"})
            RETURN error, true as isError',

            // params
            {user_id: $user_id, team_id: $team_id, pokemon_name: $pokemon_name}
        )
        YIELD value
    
        RETURN CASE value.isError
            WHEN true THEN { 
                is_error: true,
                code: value.error.code, 
                message: value.error.message
            }
            ELSE {
                set_id: id(value.newSet),
                team_id: id(value.t),
                user_id: id(value.u),
                created_at: value.newSet.created_at,
                updated_at: value.newSet.updated_at,
                set_slot: value.hs.slot,
                pokemon_name: value.p.name,
                pokemon_types: value.type,
                is_shiny: value.ip.is_shiny,
                gender: value.ip.gender,
                level: value.ip.level,
                ability_name: value.a.name,
                nature_name: value.n.name,
                stats: {
                    base: value.p.stats,
                    ivs: value.newSet.ivs,
                    evs: value.newSet.evs,
                    nature_mult: value.n.multipliers
                },
                official_artwork_link: value.p.official_artwork_link,
                sprite_link: value.p.sprite_link
            }
        END
    `;

   return await queryNeo4j(query, params);
};

/* params = {
    user_id: <number>,
    team_id: <number>,
    set_id: <number>,
    // all attributes of "updates" are optional
    updates: {
        pokemon_slot: <number 1-6>,
        pokemon_name: <string>,
        nickname: <string>,
        item_name: <string>,
        level: <number>,
        gender: <string>,
        is_shiny: <boolean>,
        ability_name: <string>,
        nature_name: <string>,
        ivs: [number 0-31], // length 6
        evs: [number 0-252] // length 6
        move1: <string>,
        move2: <string>,
        move3: <string>,
        move4: <string>,
    }
}*/
const updateSet = async (params) => {
    // need legality checking here

    let query = `
        MATCH (u:User)-[ht:HAS_TEAM]->(t:UserTeam)-[hs:HAS_SET]->(us:UserSet)-[ip:IS_POKEMON]->(:Pokemon)
        WHERE id(u) = $user_id AND id(t) = $team_id AND id(us) = $set_id AND NOT EXISTS(us.deleted_at) 
        SET 
            us.updated_at = datetime() 
            ${params.ivs ? `, us.ivs = $ivs`: ''}
            ${params.evs ? `, us.evs = $evs`: ''}
            ${params.level ? `, ip.level = $level` : ''}
            ${params.gender ? `, ip.gender = $gender` : ''}
            ${params.is_shiny ? `, ip.is_shiny = $is_shiny` : ''}
            ${params.nickname ? `, ip.nickname = $nickname` : ''}
            ${params.pokemon_slot ? `, hs.pokemon_slot = $pokemon_slot` : ''}

        ${params.pokemon_name ? `
            WITH us
            MATCH 
                (us)-[old:IS_POKEMON]->(:Pokemon),
                (p:Pokemon) WHERE p.name = $pokemon_name
            WITH us, p, old
            MERGE (us)-[:IS_POKEMON {level: $level, gender: $gender, is_shiny: $is_shiny, nickname: $nickname}]->(p)
            WITH us, old DELETE old
        ` : ''}
        
        ${params.ability_name ? `
            WITH us
            MATCH 
                (us)-[old:HAS_ABILITY]->(:Ability),
                (a:Ability) WHERE a.name = $ability_name
            WITH us, a, old
            MERGE (us)-[:HAS_ABILITY]->(a)
            WITH us, old DELETE old
        ` : ''}

        ${params.item_name ? `
            WITH us
            MATCH 
                (us)-[old:HAS_ITEM]->(:Item),
                (i:Item) WHERE i.name = $item_name
            WITH us, i, old
            MERGE (us)-[:HAS_ITEM]->(i)
            WITH us, old DELETE old
        ` : ''}

        ${params.nature_name ? `
            WITH us
            MATCH
                (us)-[old:HAS_NATURE]->(:Nature),
                (n:Nature) WHERE n.name = $nature_name 
            WITH us, n, old
            MERGE (us)-[:HAS_NATURE]->(n)
            WITH us, old DELETE old
        ` : ''}

        ${params.move1 ? `
            WITH us
            MATCH
                (us)-[old:HAS_MOVE]->(:Move),
                (m:Move)
            WHERE m.name = $move1 AND old.slot = 1
            WITH us, m, old
            MERGE (us)-[:HAS_MOVE {slot: old.slot}]->(m)
            WITH us, old DELETE old
        ` : ''}

        ${params.move2 ? `
            WITH us
            MATCH
                (us)-[old:HAS_MOVE]->(:Move),
                (m:Move)
            WHERE m.name = $move2 AND old.slot = 2
            WITH us, m, old
            MERGE (us)-[:HAS_MOVE {slot: old.slot}]->(m)
            WITH us, old DELETE old
        ` : ''}

        ${params.move3 ? `
            WITH us
            MATCH
                (us)-[old:HAS_MOVE]->(:Move),
                (m:Move)
            WHERE m.name = $move3 AND old.slot = 3
            WITH us, m, old
            MERGE (us)-[:HAS_MOVE {slot: old.slot}]->(m)
            WITH us, old DELETE old
        ` : ''}

        ${params.move4 ? `
            WITH us
            MATCH
                (us)-[old:HAS_MOVE]->(:Move),
                (m:Move)
            WHERE m.name = $move4 AND old.slot = 4
            WITH us, m, old
            MERGE (us)-[:HAS_MOVE {slot: old.slot}]->(m)
            WITH us, old DELETE old
        ` : ''}
    `;

    return await queryNeo4j(query, params);
};

const deleteSet = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(t:UserTeam)-[:HAS_SET]->(s:UserSet)
        WHERE id(u) = $user_id AND id(t) = $team_id AND id(s) = $set_id AND NOT EXISTS(s.deleted_at) 
        SET s.updated_at = datetime(), s.deleted_at = datetime()

        RETURN {
            team_id: id(t),
            set_id: id(s)
        }
    `;
    return await queryNeo4j(query, params);
};

/* params = {
    user_id: <number>,
    team_id: <number>
}*/
const getSetsByTeam = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(ut:UserTeam)-[hus:HAS_SET]->(us:UserSet) 
            WHERE id(u) = $user_id AND id(ut) = $team_id AND NOT EXISTS(us.deleted_at) 
        WITH us, hus ORDER BY hus.slot
        OPTIONAL MATCH (us)-[:HAS_ABILITY]->(a:Ability) WITH us, hus, a
        OPTIONAL MATCH (us)-[:HAS_ITEM]->(i:Item) WITH us, hus, a, i
        OPTIONAL MATCH (us)-[:HAS_NATURE]->(n:Nature) WITH us, hus, a, i, n
        OPTIONAL MATCH (us)-[ip:IS_POKEMON]->(p:Pokemon)-[ht:HAS_TYPE]->(pt:Type) WITH us, hus, a, i, n, ip, p, ht, pt ORDER BY ht.slot
        WITH us, hus, a, i, n, ip, p, collect({type_slot: ht.slot, type_name: pt.name, type_color: pt.color}) AS pokemon_types
        OPTIONAL MATCH (us)-[hm:HAS_MOVE]->(m:Move)-[:HAS_TYPE]->(mt:Type) WITH us, hus, a, i, n, ip, p, pokemon_types, hm, m, mt ORDER BY hm.slot
        WITH us, hus, a, i, n, ip, p, pokemon_types, collect({move_name: m.name, move_slot: hm.slot, type_name: mt.name, type_color: mt.color}) AS moves
        
        RETURN {
            deleted_at: us.deleted_at,
            created_at: us.created_at,
            updated_at: us.updated_at,
            set_id: id(us),
            set_slot: hus.slot,
            pokemon_name: p.name,
            pokemon_nickname: ip.nickname,
            pokemon_types: pokemon_types,
            ability_name: a.name,
            item_name: i.name,
            nature_name: n.name,
            level: ip.level,
            is_shiny: ip.is_shiny,
            gender: ip.gender,
            stats: {
                base: p.stats,
                ivs: us.ivs,
                evs: us.evs,
                nature_mult: n.multipliers
            },
            moves: moves,
            sprite_link: p.sprite_link,
            official_artwork_link: p.official_artwork_link
        }`;
    return await queryNeo4j(query, params);
};

/* params = {
    user_id: <number>,
    set_id: <number>,
}*/
const getSetOptions = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(ut:UserTeam)-[hus:HAS_SET]->(us:UserSet)-[ip:IS_POKEMON]-(p:Pokemon)
            WHERE id(u) = $user_id AND id(us) = $set_id AND NOT EXISTS(us.deleted_at)
        WITH p
        MATCH (p)-[ha:HAS_ABILITY]->(a:Ability) WITH p, a ORDER BY a.slot
        WITH p, collect(DISTINCT a.name) AS abilities
        MATCH (p)-[hm:HAS_MOVE]->(m:Move)-[ht:HAS_TYPE]->(t:Type) WITH abilities, t, m ORDER BY m.name
        WITH abilities, collect({
            name: m.name, 
            effect: m.effect, 
            effect_chance: m.effect_chance, 
            pp: m.pp, 
            damage_class: m.damage_class,
            power: m.power,
            accuracy: m.accuracy,
            priority: m.priority,
            type: {name: t.name, color: t.color},
            target: m.target
        }) AS moves
        RETURN {
            abilities: abilities,
            moves: moves
        }`;
    
    let setOptions = await queryNeo4j(query, params);
    return await setOptions[0];
};

const userCtx = {
    createTeam,
    updateTeam,
    deleteTeam,
    createSet,
    updateSet,
    deleteSet,
    getTeamPreviews,
    getSetsByTeam,
    getSetOptions
};

module.exports = userCtx;
