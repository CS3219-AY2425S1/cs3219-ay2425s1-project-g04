const WebSocket = require('ws');
const { manageRoom, getUsersInRoom} = require('../utils/roomManager');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('User connected to the collaboration space');

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'joinRoom':
                    // add user into room with roomId
                    manageRoom(ws, data.roomId, data.userId, "join");
                    break;
                case 'leaveRoom':
                    // remove user from room with roomId
                    manageRoom(ws, data.roomId, data.userId, "leave");
                    break;
                case 'requestUserList': 
                    const users = getUsersInRoom(data.roomId);
                    ws.send(JSON.stringify({
                        type: 'usersListUpdate',
                        users
                    }));
                    break;
                default:
                    console.error('Unknown message type');
            }
        });

        ws.on('close', () => {
            console.log('User disconnected from collaboration space');
        });
    });

}

module.exports = { setupWebSocket };
