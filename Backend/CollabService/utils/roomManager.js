const WebSocket = require('ws');
const rooms = {};  // { roomId: [sockets] }

function manageRoom(ws, roomId, userId, type) {

    switch (type) {
        case "join":
            if (!rooms[roomId]) {
                rooms[roomId] = { sockets: [], userIds: []};
            }

            const room = rooms[roomId];
            if (room.userIds.length < 2) {
                // add user to room 
                room.sockets.push(ws);
                room.userIds.push(userId);
                console.log(`room ${roomId} authorized users are ${room.userIds}`)
            }

            if (!room.userIds.includes(userId)){
                console.log(`User ${userId} is denied access to room ${roomId}`);
                ws.send(JSON.stringify({ type: 'accessDenied', message: 'You are not allowed to access this room.' }));
                ws.close();
                return;
            }

            // set websocket roomId 
            ws.roomId = roomId;

            console.log(`[roomManager] User ${userId} joined room ${roomId}`);

            // notify users of roomId of updated user list to display in frontend
            broadcastUserListUpdate(roomId);
            break;

        case "leave":
            // remove from room 
            rooms[roomId].sockets = rooms[roomId].sockets.filter(socket => socket !== ws);
            // rooms[roomId].userIds = rooms[roomId].userIds.filter(user => user !== userId);

            console.log(`User ${userId} left the room ${roomId}`);

            // if no one in room delete room 
            if (rooms[roomId].sockets.length === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} is empty and deleted`);
            } else {
                broadcastUserListUpdate(roomId);
            }
            break;
        default:
            console.error(`Unknown room management type: ${type}`);
            break;
    }

    // Remove user when they disconnect
    ws.on('close', () => {

        if (rooms[roomId]) {
            rooms[roomId].sockets = rooms[roomId].sockets.filter(client => client !== ws);
            rooms[roomId].userIds = rooms[roomId].userIds.filter(user => user != userId);

            console.log(`User ${userId} left room ${roomId}`);

            if (rooms[roomId].sockets.length === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} is empty and deleted`);
            } else {
                // notify the remaining party about leave 
                broadcastUserListUpdate(roomId);
            }

        }
        
    });

    function broadcastUserListUpdate(roomId) {
        const userList = rooms[roomId].userIds;

        rooms[roomId].sockets.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'usersListUpdate', users: userList}));
            }
        })
    }
}

function getUsersInRoom(roomId){
    return rooms[roomId]?.userIds || [];
}

module.exports = { manageRoom, getUsersInRoom };