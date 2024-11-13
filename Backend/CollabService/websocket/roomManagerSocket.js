const WebSocket = require('ws');
const { manageRoom, getUsersInRoom, getRoom} = require('../utils/roomManager');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('User connected to the collaboration space');

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'joinRoom':
                    // add user into room with roomId
                    manageRoom(ws, data.roomId, data.username, "join");
                    break;
                case 'leaveRoom':
                    // remove user from room with roomId
                    manageRoom(ws, data.roomId, data.username, "leave");
                    break;
                case 'requestUserList':
                    const users = getUsersInRoom(data.roomId);
                    ws.send(JSON.stringify({
                        type: 'usersListUpdate',
                        users
                    }));
                    break;
                case 'sendMessage':
                    // send message to all users in room
                    console.log('got message ', data.message);
                    broadcastMessage(data.roomId, data.message);
                    break;
                case 'languageChange':
                    // send message to all users in room
                    console.log('got language change ', data.language);
                    broadcastLanguageChange(data.roomId, data.language, data.user);
                    break;
                default:
                    console.error('Unknown message type');
            }
        });

        ws.on('close', () => {
            console.log('User disconnected from collaboration space');
        });
    });

    function broadcastMessage(roomId, message) {
        const room = getRoom(roomId)
        if (room) {
            room.sockets.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'newMessage', message: message }));
                }
            })
        }
    }

    function broadcastLanguageChange(roomId, language, userId) {
        const room = getRoom(roomId)
        if (room) {
            room.sockets.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'languageChange', language: language , user: userId}));
                }
            })
        }
    }

}

module.exports = { setupWebSocket };
