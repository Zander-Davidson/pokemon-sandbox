// this file lets me access the singleton db driver on demand. when accessed,
// create a new session to make queries, and REMEMBER TO CLOSE THE SESSION AFFTER.
// the method ./utilities/Utilities.queryNeo4j automates this further

const assert = require("assert");
const neo4j = require('neo4j-driver');

let _db;

var neo4jURL;
var neo4jUser;
var neo4jPass;
var neo4jEncryption;

neo4jURL = process.env.NEO4J_BOLT_URL;
neo4jUser = process.env.NEO4J_BOLT_USER;
neo4jPass = process.env.NEO4J_BOLT_PASSWORD;
neo4jEncryption = process.env.NEO4J_BOLT_ENCRYPTION;


function initDb() {
    if (_db) {
        console.warn("Trying to init DB again!");
        return;
    }
    
    try {
        _db = neo4j.driver(
            neo4jURL, 
            neo4j.auth.basic(neo4jUser, neo4jPass),
            // without disableLosslessIntegers, neo4j identity numbers are returned as {high: ###, low: ###}
            {encrypted: neo4jEncryption, disableLosslessIntegers: true},
        );
    }
    catch(err) {
        console.log("Error while trying to create instance of NeO4j driver: " + err.message);
    }
}

function getDb() {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
}

module.exports = {
    getDb,
    initDb
};