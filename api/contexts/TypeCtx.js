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

    async createTypes() {
        let query = `
            CREATE
            (Normal:Type {name: "Normal", color: "#aa9"}),
            (Fighting:Type {name: "Fighting", color: "#b54"}),
            (Flying:Type {name: "Flying", color: "#89f"}),
            (Poison:Type {name: "Poison", color: "#a59"}),
            (Ground:Type {name: "Ground", color: "#db5"}),
            (Rock:Type {name: "Rock", color: "#ba6"}),
            (Bug:Type {name: "Bug", color: "#ab2"}),
            (Ghost:Type {name: "Ghost", color: "#66b"}),
            (Steel:Type {name: "Steel", color: "#aab"}),
            (Fire:Type {name: "Fire", color: "#f42"}),
            (Water:Type {name: "Water", color: "#39f"}),
            (Grass:Type {name: "Grass", color: "#7c5"}),
            (Electric:Type {name: "Electric", color: "#fc3"}),
            (Psychic:Type {name: "Psychic", color: "#f59"}),
            (Ice:Type {name: "Ice", color: "#6cf"}),
            (Dragon:Type {name: "Dragon", color: "#76e"}),
            (Dark:Type {name: "Dark", color: "#754"}),
            (Fairy:Type {name: "Fairy", color: "#e9e"}),
            (Unknown:Type {name: "Unknown", color: "#44685E"})
            
            CREATE
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Fighting)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Normal), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Ghost)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Normal), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Normal), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Ground)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fire), (Rock)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fire), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Steel)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), (Fire)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), (Water)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fire), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Ice)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fire), (Fairy)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fire), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Steel)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Water), (Fire)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Water), (Water)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Water), (Grass)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Water), (Electric)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Water), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Ice)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Water), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Water), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Flying)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Electric), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Ground)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Electric), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Steel)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Electric), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Electric)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Electric), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Electric), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Flying)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Grass), (Poison)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Grass), (Ground)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Grass), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Bug)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Grass), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Fire)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Grass), (Water)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Grass), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Grass), (Electric)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Grass), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Ice)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Grass), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Grass), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Fighting)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ice), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Rock)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ice), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Steel)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ice), (Fire)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ice), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Ice)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Ice), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ice), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Flying)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fighting), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Rock)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fighting), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fighting), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Psychic)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fighting), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fighting), (Dark)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fighting), (Fairy)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fighting), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Fighting)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Poison), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Poison)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Poison), (Ground)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Poison), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Poison), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Poison), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Psychic)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Poison), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Poison), (Fairy)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Poison), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Poison)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Ground), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Rock)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Ground), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Water)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ground), (Grass)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ground), (Electric)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Ground), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Ice)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ground), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ground), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Fighting)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Flying), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Ground)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Flying), (Rock)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Flying), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Flying), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Flying), (Electric)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Flying), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Ice)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Flying), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Flying), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Fighting)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Psychic), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Bug)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Psychic), (Ghost)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Psychic), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Psychic)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Psychic), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), (Dark)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Psychic), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Psychic), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Fighting)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Bug), (Flying)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Bug), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Ground)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Bug), (Rock)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Bug), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Fire)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Bug), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Bug), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Bug), 
            (Normal)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Rock), (Fighting)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Rock), (Flying)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Rock), (Poison)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Rock), (Ground)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Rock), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Steel)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Rock), (Fire)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Rock), (Water)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Rock), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Rock), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Rock), 
            (Normal)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Ghost), (Fighting)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Ghost), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Poison)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Ghost), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Ghost), (Ghost)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ghost), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), (Dark)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Ghost), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Ghost), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Fighting)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Bug)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Fire)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dragon), (Water)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dragon), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dragon), (Electric)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dragon), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Ice)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dragon), (Dragon)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dragon), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dragon), (Fairy)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dragon), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Fighting)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dark), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Poison)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Bug)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dark), (Ghost)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dark), (Steel)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Psychic)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Dark), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Dragon)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Dark), (Dark)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Dark), (Fairy)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Dark), 
            (Normal)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Fighting)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Steel), (Flying)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Poison)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Steel), (Ground)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Steel), (Rock)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Steel), (Steel)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Fire)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Steel), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Steel), (Grass)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Steel), (Psychic)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Ice)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Dragon)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), (Dark)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Steel), (Fairy)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Steel), 
            (Normal)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Fighting)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fairy), (Flying)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Poison)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fairy), (Ground)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Rock)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Bug)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fairy), (Ghost)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Steel)-[:MATCHUP {effectiveness: "Super effective", multiplier: 2.0}]->(Fairy), (Fire)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Water)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Grass)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Electric)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Psychic)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Ice)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy), (Dragon)-[:MATCHUP {effectiveness: "Not effective", multiplier: 0.0}]->(Fairy), (Dark)-[:MATCHUP {effectiveness: "Not very effective", multiplier: 0.5}]->(Fairy), (Fairy)-[:MATCHUP {effectiveness: "Effective", multiplier: 1.0}]->(Fairy)
            
            MATCH(t:Type) SET t.name = toLower(t.name)
        `
        return await utilities.queryNeo4j(query);
    }

    // TODO:
    // async getTypeByPokemonName(pokemonName) {}
    // async getTypeByMoveName(moveName) {}
}

module.exports = new TypeCtx;