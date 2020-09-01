const { Relationship } = require("neo4j-driver");

const getDb = require("../db").getDb;

class Utilities {

    // extract only the properties of simple nodes (no relationships) from a list Neo4j records 
    formatNeo4jNodes(records) {
        if (!Array.isArray(records)) {
            return null;
        } else {
            // return first element of inner array (removes unnecessary 2D arrays)
            var formattedRecords = records.map(r => {
                return r._fields.map(f => {
                    return f.properties;
                })[0];
            });

            return formattedRecords.length === 1 ? formattedRecords[0] : formattedRecords;
        }
    }

    async queryNeo4j(query, params, formatter) {
        var session = getDb().session();
        try {
            let results = await session.run(query, params);

            if (await results.records.length === 0) {
                return null;
            } else if (formatter) {
                return await formatter(await results.records);
            } else {
                return await this.formatNeo4jNodes(await results.records);
            }
             
        } catch(err) {
            console.log(err);
            return undefined;

        } finally {
            await session.close();
        }
    }
}

module.exports = new Utilities;