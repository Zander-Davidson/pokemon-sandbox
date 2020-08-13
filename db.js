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

console.log("graphenedbURL: " + graphenedbURL);
console.log("graphenedbUser: " + graphenedbUser);
console.log("graphenedbPass: " + graphenedbPass);
console.log("graphenedbEncryption: " + graphenedbEncryption);

function initDb() {
    if (_db) {
        console.warn("Trying to init DB again!");
        return;
    }
    
    try {
        _db = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass), {encrypted: graphenedbEncryption});
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