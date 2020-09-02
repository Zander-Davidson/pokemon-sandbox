// this file lets me access the singleton db driver on demand. when accessed,
// create a new session to make queries, and REMEMBER TO CLOSE THE SESSION AFFTER.
// the method ./utilities/Utilities.queryNeo4j automates this further

const assert = require("assert");
const neo4j = require('neo4j-driver');

let _db;

const isDev = process.env.NODE_ENV !== 'production';

var graphenedbURL;
var graphenedbUser;
var graphenedbPass;
var graphenedbEncryption;

if (isDev) {
    graphenedbURL = 'bolt://localhost:7687';
    graphenedbUser = 'neo4j';
    graphenedbPass = 'password';
    graphenedbEncryption = 'ENCRYPTION_OFF';
} else {
    graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
    graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
    graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
    graphenedbEncryption = 'ENCRYPTION_ON';
}

function initDb() {
    if (_db) {
        console.warn("Trying to init DB again!");
        return;
    }
    
    try {
        _db = neo4j.driver(
            graphenedbURL, 
            neo4j.auth.basic(graphenedbUser, graphenedbPass),
            // without disableLosslessIntegers, neo4j identity numbers are returned as {high: ###, low: ###}
            {encrypted: graphenedbEncryption, disableLosslessIntegers: true},
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