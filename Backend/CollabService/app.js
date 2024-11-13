const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket/roomManagerSocket');
const { setUpYjsSocket } = require('./websocket/collabSocket');
const app = express();
 
const server = http.createServer(app);

// Set up Yjs server 
setUpYjsSocket();

// Set up WebSocket server and attach to HTTP server
setupWebSocket(server);


// Basic route to test the server
app.get('/', (req, res) => {
    res.send('CollabService using Yjs is running');
});



module.exports = { server };
