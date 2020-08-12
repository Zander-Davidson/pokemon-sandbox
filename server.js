/* spins up a Node.js server */

// provides some functionality for starting a server
const http = require('http');
const app = require('./app');

// the port to listen to requests on. 3000 is default if no environment variable present
const port = process.env.PORT || 3000;

// this takes a function that is executed whenever we get a new request. it then returns a response
const server = http.createServer(app);

// start the server using the port
server.listen(port);
