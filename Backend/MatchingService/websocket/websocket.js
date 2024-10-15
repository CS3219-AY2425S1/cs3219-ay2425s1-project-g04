// TODO: Write socket logic to connect backend to frontend here 

/*
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('User connected to WebSocket');
    
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('User disconnected from WebSocket');
    });
});

function notifyUsers(userId, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ userId, message }));
        }
    });
}

module.exports = { notifyUsers };
*/