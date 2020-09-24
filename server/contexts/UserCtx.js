const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class UserCtx {

    /* data = {
        username: <string>
    }*/
    async createUser(data) {
        let query = `
            MERGE(u:User {
                username: $username,
                created_at: datetime()
            }) RETURN u
        `;
        return await utilities.queryNeo4j(query, data);
    }


    // return specified User (or return all Users if no name supplied)
    async getUser(username) {
        if (username) {
            let query = 'MATCH (u:User {username: $username}) RETURN u';
            let params = {username: username};
            let user = await utilities.queryNeo4j(query, params);

            if (Array.isArray(user) && user.length === 0) {
                return null;
            }
            
            return user;
        } else {
            return null;
        }
    }


    /* data = {
        name: <string>
    } */
    async createUserTeam(data) {
        let query = `
            MATCH (u:User {username: $username})

            MERGE (ut:UserTeam {
                created_at: datetime(),
                updated_at: datetime(),
                name: $name
            })

            MERGE (u)-[:HAS_TEAM]->(ut)

            RETURN ut
        `;
        return await utilities.queryNeo4j(query, data);
    }

    /* data: {
        userid: <number>,
        teamid: <number>,
        new_team_name
    } */
    async updateUserTeam(data) {}

    /* data: {
        userid: <number>,
        teamid: <number>
    } */
    async deleteUserTeam(data) {}

    // TODO: make this consistent with the others and change signature to getUserTeamPreviews
    async getUserTeams(username) {
        if (username) {
            let query = `
                MATCH (u:User {username: $username})-[:HAS_TEAM]->(t:UserTeam) WITH t
                OPTIONAL MATCH (t)-[hs:HAS_SET]->(s:UserSet)-[:IS_POKEMON]->(p:Pokemon) WITH t, s, hs, p
                ORDER BY t.updated_at DESC, hs.slot
                RETURN {
                    guid: id(t), 
                    name: t.name, 
                    sets: CASE WHEN s IS NOT NULL THEN collect({guid: id(s), slot: hs.slot, sprite_link: p.sprite_link})
                        ELSE [] END
                }`;
            let params = {username: username};
            return await utilities.queryNeo4j(query, params, utilities.jsonReturnFormatter);
        } else {
            return null;
        }
    }


    /* data = {
        user_id: <number>,
        team_id: <number>
    }*/
    async getUserSetsByTeam(data) {
        let query = `
            MATCH (u:User)-[:HAS_TEAM]->(ut:UserTeam)-[hus:HAS_SET]->(us:UserSet) 
                WHERE id(u) = $user_id AND id(ut) = $team_id WITH us, hus ORDER BY hus.slot
            MATCH (us)-[:HAS_ABILITY]->(a:Ability) WITH us, hus, a
            MATCH (us)-[:HAS_ITEM]->(i:Item) WITH us, hus, a, i
            MATCH (us)-[:HAS_NATURE]->(n:Nature) WITH us, hus, a, i, n
            MATCH (us)-[ip:IS_POKEMON]->(p:Pokemon)-[ht:HAS_TYPE]->(pt:Type) WITH us, hus, a, i, n, ip, p, ht, pt ORDER BY ht.slot
            WITH us, hus, a, i, n, ip, p, collect({type_slot: ht.slot, type_name: pt.name, type_color: pt.color}) AS pokemon_types
            MATCH (us)-[hs:HAS_STAT]->(s:Stat) WITH us, hus, a, i, n, ip, p, pokemon_types, hs, s ORDER BY s.order
            WITH us, hus, a, i, n, ip, p, pokemon_types, collect({stat_name: s.name, evs: hs.evs, ivs: hs.ivs}) AS stats
            MATCH (us)-[hm:HAS_MOVE]->(m:Move)-[:HAS_TYPE]->(mt:Type) WITH us, hus, a, i, n, ip, p, stats, pokemon_types, hm, m, mt ORDER BY hm.slot
            WITH us, hus, a, i, n, ip, p, pokemon_types, stats, collect({move_name: m.name, move_slot: hm.slot, type_name: mt.name, type_color: mt.color}) AS moves
            
            RETURN collect({
                set_name: us.name,
                guid: id(us),
                set_slot: hus.slot,
                pokemon_name: p.name,
                pokemon_types: pokemon_types,
                ability_name: a.name,
                item_name: i.name,
                nature_name: n.name,
                level: ip.level,
                is_shiny: ip.is_shiny,
                gender: ip.gender,
                pokemon_nickname: ip.nickname,
                stats: stats,
                moves: moves,
                sprite_link: p.sprite_link,
                official_artwork_link: p.official_artwork_link
            })`;
        return await utilities.queryNeo4j(query, data, utilities.jsonReturnFormatter)
    }
    
   
}

module.exports = new UserCtx;