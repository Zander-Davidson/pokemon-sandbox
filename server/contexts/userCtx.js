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
        OPTIONAL MATCH (t)-[hs:HAS_SET]->(s:UserSet)-[:IS_POKEMON]->(p:Pokemon) WITH t, s, hs, p
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

/* data = {
    user_id: [number],
    team_id: [string],
    set_name: [string],
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
        MATCH 
            (u:User), 
            (t:UserTeam)-[:HAS_SET]->(sets:UserSet)
        WHERE id(u) = $user_id AND id(t) = $team_id
        WITH count(sets) AS numSets
        CALL apoc.do.when(numSets < 6,
            'MATCH 
                (u:User), 
                (t:UserTeam)-[:HAS_SET]->(sets:UserSet),
                (p:Pokemon)-[ha:HAS_ABILITY]->(a:Ability),
                (n:Nature)
            WHERE id(u) = $user_id AND id(t) = $team_id 
                AND p.name = $pokemon_name AND ha.slot = 1 AND n.name = "bashful"
            WITH u, t, a, n, p, count(sets) AS numSets
            MERGE 
                (t)-[hs:HAS_SET {slot: numSets + 1}]
                    ->(newSet:UserSet {
                        created_at: datetime(),
                        updated_at: datetime()
                    })
                -[ip:IS_POKEMON {
                    gender: "male",
                    is_shiny: false,
                    level: 100
                }]
                    ->(p)
            MERGE (newSet)-[:HAS_ABILITY]->(a)
            MERGE (newSet)-[:HAS_NATURE]->(n)
            RETURN t, u, hs, ip, a, n, newSet, p, false as isError',

            // else get the proper error
            'MATCH(error:Error {code: "ucs1"})
            RETURN error,  true as isError',

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
                set_slot: value.hs.slot,
                is_shiny: value.ip.is_shiny,
                gender: value.ip.gender,
                level: value.ip.level,
                ability_name: value.a.name,
                nature_name: value.n.name,
                official_artwork_link: value.p.official_artwork_link
            }
        END
    `;
    
   return await queryNeo4j(query, params);

    // return await queryNeo4j(query, params);

    // let query = `
    //     UNWIND $stats AS sMap
    //     UNWIND $moves AS mMap
    //     MATCH
    //         (p:Pokemon {name: $pokemon_name}),
    //         (i:Item {name: $item_name}),
    //         (p)-[:HAS_ABILITY]->(a:Ability {name: $ability_name}),
    //         (n:Nature {name: $nature_name}),
    //         (s:Stat {name: sMap.stat_name}),
    //         (p)-[:EVOLVES_FROM|HAS_MOVE*]->(m:Move {name: mMap.move_name}),
    //         (u:User),
    //         (ut:UserTeam)
    //     WHERE id(u) = $user_id AND id(ut) = $team_id

    //     MERGE (us:UserSet {name: $set_name, created_at: datetime(), updated_at: datetime()})
    //     MERGE (us)-[:IS_POKEMON {nickname: $nickname, is_shiny: $is_shiny, level: $level, gender: $gender}]->(p)
    //     MERGE (us)-[:HAS_ITEM]->(i)
    //     MERGE (us)-[:HAS_ABILITY]->(a)
    //     MERGE (us)-[:HAS_NATURE]->(n)
    //     MERGE (us)-[:HAS_MOVE {slot: mMap.move_slot}]->(m)
    //     MERGE (us)-[:HAS_STAT {evs: sMap.evs, ivs: sMap.ivs}]->(s)
    //     MERGE (u)-[:HAS_SET]->(us)
    //     MERGE (ut)-[:HAS_SET {slot: $pokemon_slot}]->(us)
    //     SET ut.updated_at: datetime()
    //     RETURN us
    // `;
};

const updateSet = async (params) => { };

const deleteSet = async (params) => { };

/* data = {
    user_id: <number>,
    team_id: <number>
}*/
const getSetsByTeam = async (params) => {
    let query = `
        MATCH (u:User)-[:HAS_TEAM]->(ut:UserTeam)-[hus:HAS_SET]->(us:UserSet) 
            WHERE id(u) = $user_id AND id(ut) = $team_id WITH us, hus ORDER BY hus.slot
        OPTIONAL MATCH (us)-[:HAS_ABILITY]->(a:Ability) WITH us, hus, a
        OPTIONAL MATCH (us)-[:HAS_ITEM]->(i:Item) WITH us, hus, a, i
        OPTIONAL MATCH (us)-[:HAS_NATURE]->(n:Nature) WITH us, hus, a, i, n
        OPTIONAL MATCH (us)-[ip:IS_POKEMON]->(p:Pokemon)-[ht:HAS_TYPE]->(pt:Type) WITH us, hus, a, i, n, ip, p, ht, pt ORDER BY ht.slot
        WITH us, hus, a, i, n, ip, p, collect({type_slot: ht.slot, type_name: pt.name, type_color: pt.color}) AS pokemon_types
        OPTIONAL MATCH (us)-[hs:HAS_STAT]->(s:Stat) WITH us, hus, a, i, n, ip, p, pokemon_types, hs, s ORDER BY s.order
        WITH us, hus, a, i, n, ip, p, pokemon_types, collect({stat_name: s.name, evs: hs.evs, ivs: hs.ivs}) AS stats
        OPTIONAL MATCH (us)-[hm:HAS_MOVE]->(m:Move)-[:HAS_TYPE]->(mt:Type) WITH us, hus, a, i, n, ip, p, stats, pokemon_types, hm, m, mt ORDER BY hm.slot
        WITH us, hus, a, i, n, ip, p, pokemon_types, stats, collect({move_name: m.name, move_slot: hm.slot, type_name: mt.name, type_color: mt.color}) AS moves
        
        RETURN {
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
            stats: stats,
            moves: moves,
            sprite_link: p.sprite_link,
            official_artwork_link: p.official_artwork_link
        }`;
    return await queryNeo4j(query, params);
};

const userCtx = {
    createTeam,
    updateTeam,
    deleteTeam,
    createSet,
    updateSet,
    deleteSet,
    getTeamPreviews,
    getSetsByTeam
};

module.exports = userCtx;
