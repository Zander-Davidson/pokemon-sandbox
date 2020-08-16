const utilities = require("../utilities/Utilities");

class TypeCtx {

    // return specified Type (or return all Types if no name supplied)
    async getType(name) {
        let query = name ? 
            'MATCH (t:Type {name: $name}) RETURN t'
            : 'MATCH (t:Type) RETURN t';
        let params = { name: name ? name : null };
        let type = await utilities.queryNeo4j(query, params);

        if (Array.isArray(type) && type.length === 0) {
            return null;
        }
        
        return type;
    }

    // return details for a matchup of 2 specified types
    async getTypeMatchup(attacking, defending) {
        let query = 'MATCH(atk:Type {name: $attacking})-[m:MATCHUP]->(def:Type {name: $defending}) RETURN atk, def, m';
        let params = {
            attacking: attacking,
            defending: defending
        };    
        
        const formatter = (records) => {
            let fields = records[0]._fields;
            let formatted = {};

            formatted.attacking = fields[0].properties;
            formatted.defending = fields[1].properties;
            formatted.effectiveness = fields[2].properties.effectiveness;
            formatted.multiplier = fields[2].properties.multiplier;

            return formatted;
        }
        
        return await utilities.queryNeo4j(query, params, formatter);
    }

    // return all attacking types of a specified effectiveness against a given defending type
    async getMatchupsByDefending(defending, multiplier) {
        let query = multiplier ?
            'MATCH(atk:Type)-[m:MATCHUP {multiplier: $multiplier}]->(def:Type {name: $defending}) RETURN def, atk, m'
            : 'MATCH(atk:Type)-[m:MATCHUP]->(def:Type {name: $defending}) RETURN def, atk, m';

        let params = {
            defending: defending,
            multiplier: multiplier ? multiplier : null
        };

        const formatter = (records) => {
            let formatted = {
                defending: {},
                attacking: []
            };

            records.forEach((r, i) => {
                let fields = r._fields;

                if (i === 0) {
                    formatted.defending = fields[0].properties;
                }

                formatted.attacking.push({
                    name: fields[1].properties.name,
                    color: fields[1].properties.color,
                    multiplier: fields[2].properties.multiplier,
                    effectiveness: fields[2].properties.effectiveness
                })
            });

            return formatted;
        }

        return await utilities.queryNeo4j(query, params, formatter);
    }

    // return all defending types of a specified effectiveness against a given attacking type
    async getMatchupsByAttacking(attacking, multiplier) {
        let query = multiplier ? 
            'MATCH(atk:Type {name: $attacking})-[m:MATCHUP {multiplier: $multiplier}]->(def:Type) RETURN atk, def, m'
            : 'MATCH(atk:Type {name: $attacking})-[m:MATCHUP]->(def:Type) RETURN atk, def, m';
        let params = {
            attacking: attacking,
            multiplier: multiplier ? multiplier : null
        };        
        const formatter = (records) => {
            let formatted = {
                attacking: {},
                defending: []
            };
            
            records.forEach((r, i) => {
                let fields = r._fields;

                if (i === 0) {
                    formatted.attacking = fields[0].properties;
                }

                formatted.defending.push({
                    name: fields[1].properties.name,
                    color: fields[1].properties.color,
                    multiplier: fields[2].properties.multiplier,
                    effectiveness: fields[2].properties.effectiveness
                })
            });

            return formatted;
        }

        return await utilities.queryNeo4j(query, params, formatter);
    }

    // TODO:
    // async getTypeByPokemonName(pokemonName) {}
    // async getTypeByMoveName(moveName) {}
}

module.exports = new TypeCtx;