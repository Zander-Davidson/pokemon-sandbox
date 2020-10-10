const getDb = require("../db").getDb;


// extract only the properties of simple nodes (no relationships) from a list Neo4j records 
const lazyNodeFormatter = (records) => {
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

// returns the results of cypher queries that return a json object
let jsonReturnFormatter = (records) => {
    let formattedRecords = records.map(r => {
        return r._fields[0];
    });
    return formattedRecords;
};    let formatter = (records) => {
    let formattedRecords = records.map(r => {
        return r._fields[0];
    });
    return formattedRecords;
};

const queryNeo4j = async (query, params, formatter) => {
    var session = getDb().session();
    var results;
    try {
        results = await session.run(query, params);        
    } catch(err) {
        console.log(err);
        return undefined;        
    } finally {
        await session.close();
    }
    
    if (await results.records.length === 0) {
        return null;
    } else if (formatter) {
        return await formatter(await results.records);
    } else {
        return await jsonReturnFormatter(await results.records);
    }
}

const utilities = {
    queryNeo4j: queryNeo4j,
    jsonReturnFormatter: jsonReturnFormatter,
    lazyNodeFormatter: lazyNodeFormatter
}

module.exports = utilities;
