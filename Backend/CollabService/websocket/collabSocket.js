const WebSocket = require('ws');
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils');

function setUpYjsSocket() {

    const server = http.createServer();
    
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        console.log('New client connected');

        setupWSConnection(ws, req);

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(1234, () => {
        console.log('Websocket server is listening on ws://external-ip:1234')
    })
}

module.exports = { setUpYjsSocket };