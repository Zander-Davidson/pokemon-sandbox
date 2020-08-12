/* this file spins up an Express application that makes handling requests easier for us */

const express = require('express');
const neo4j = require('neo4j-driver');
// a logger middleware. morgan will use the 'next' method (passed to api functions) 
// in order to log api requests in the console without interfering
const morgan = require('morgan');
const bodyParser = require('body-parser');


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

var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass), {encrypted: graphenedbEncryption});

const app = express(); // start the express application which lets us use utility methods, etc.

// redirecting function passed into app.use() to the file with route specified
const poketypesRoutes = require('./api/routes/poketypes');
const pokemovesRoutes = require('./api/routes/pokemoves');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// ensures the api can handle different-origin requests (requests from urls other than here) AKA handles CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET') // UPDATE?
        return res.status(200).json({});
    }
    next();
});

// .use() sets up some middleware. an incoming request (and its body) must go through .use() 
app.use('/poketypes', poketypesRoutes);
app.use('/pokemoves', pokemovesRoutes);

// forward an invalid route request using the 'next' function
app.use((req, res, next) => {
    const error = new Error('Sorry, we couldn\'t find that for you :(');
    error.status = 404;
    next(error);
});

// handles errors thrown from anywhere in the application
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;