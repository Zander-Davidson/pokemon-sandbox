const utilities = require("../utilities/Utilities");
const fetch = require("node-fetch");

class UserCtx {
     // return specified User (or return all Users if no name supplied)
     async getUser(name) {
        if (name) {
            let query = 'MATCH (u:User {name: $name}) RETURN u';
            let params = {name: name};
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
        if (name) {
            let query = `MATCH (u:User {name: $username})-[:HAS_TEAM]->(t:Team) RETURN t`;
            let params = {username: username};
            return await utilities.queryNeo4j(query, params);
        } else {
            return null;
        }
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
            MERGE (us)-[:IS_POKEMON {nickname: $nickname, is_shiny: $is_shiny}]->(p)
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