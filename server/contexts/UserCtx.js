const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class UserCtx {
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


    async getUserSetsByTeam(userTeamData) {
        let query = `
            MATCH (ut:UserTeam)-[hus:HAS_SET]->(us:UserSet) 
                WHERE id(ut) = $teamguid WITH us, hus ORDER BY hus.slot
            MATCH (us)-[:HAS_ABILITY]->(a:Ability) WITH us, hus, a
            MATCH (us)-[:HAS_ITEM]->(i:Item) WITH us, hus, a, i
            MATCH (us)-[:HAS_NATURE]->(n:Nature) WITH us, hus, a, i, n
            MATCH (us)-[ip:IS_POKEMON]->(p:Pokemon) WITH us, hus, a, i, n, ip, p
            MATCH (us)-[hs:HAS_STAT]->(s:Stat) WITH us, hus, a, i, n, ip, p, hs, s ORDER BY s.order
            WITH us, hus, a, i, n, ip, p, collect({stat_name: s.name, evs: hs.evs, ivs: hs.ivs}) AS stats
            MATCH (us)-[hm:HAS_MOVE]->(m:Move) WITH us, hus, a, i, n, ip, p, stats, hm, m ORDER BY hm.slot
            WITH us, hus, a, i, n, ip, p, stats, collect({move_name: m.name, move_slot: hm.slot}) AS moves
            
            RETURN collect({
                set_name: us.name,
                set_guid: id(us),
                set_slot: hus.slot,
                pokemon_name: p.name,
                ability_name: a.name,
                item_name: i.name,
                nature_name: n.name,
                level: ip.level,
                is_shiny: ip.is_shiny,
                pokemon_nickname: ip.nickname,
                stats: stats,
                moves: moves,
                sprite_link: p.sprite_link,
                official_artwork_link: p.official_artwork_link
            })`;
        return await utilities.queryNeo4j(query, userTeamData, utilities.jsonReturnFormatter)
    }


    /* data = {
        username: [string]
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


    /* data = {
        name: [string]
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

    
    /* data = {
        username: [string],
        user_team_name: [string],
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
    async createUserSet(data) {
        // TODO: verify fields
        
        let query = `
            UNWIND $stats AS sMap
            UNWIND $moves AS mMap

            MATCH
                (p:Pokemon {name: $pokemon_name}),
                (i:Item {name: $item_name}),
                (p)-[:HAS_ABILITY]->(a:Ability {name: $ability_name}),
                (n:Nature {name: $nature_name}),
                (s:Stat {name: sMap.stat_name}),
                (p)-[:EVOLVES_FROM|HAS_MOVE*]->(m:Move {name: mMap.move_name}),
                (u:User {username: $username}),
                (ut:UserTeam {name: $user_team_name})
            
            MERGE (us:UserSet {name: $set_name, created_at: datetime(), updated_at: datetime()})
            MERGE (us)-[:IS_POKEMON {nickname: $nickname, is_shiny: $is_shiny, level: $level}]->(p)
            MERGE (us)-[:HAS_ITEM]->(i)
            MERGE (us)-[:HAS_ABILITY]->(a)
            MERGE (us)-[:HAS_NATURE]->(n)
            MERGE (us)-[:HAS_MOVE {slot: mMap.move_slot}]->(m)
            MERGE (us)-[:HAS_STAT {evs: sMap.evs, ivs: sMap.ivs}]->(s)

            MERGE (u)-[:HAS_SET]->(us)
            MERGE (ut)-[:HAS_SET {slot: $pokemon_slot}]->(us)
            SET ut.updated_at: datetime()

            RETURN us
        `;
        return await utilities.queryNeo4j(query, data);
    }
}

module.exports = new UserCtx;