const WebSocket = require('ws');
const rooms = {};  // { roomId: [sockets] }

function manageRoom(ws, roomId, userId, type) {
    console.log(`manageRoom function: ${type} ${userId}`)

    ws.hasLeft = false;

    switch (type) {
        case "join":

            // userIds -> track users in room
            // matchedUserIds -> check authorized users
            if (!rooms[roomId]) {
                rooms[roomId] = { sockets: [], userIds: [], matchedUserIds: [], startTime: new Date().toISOString()};
            }

            // Broadcast start time to the newly joined user
            broadcastRoomStartTime(ws, roomId);

            console.log(`BEFORE room Info: userIds[${rooms[roomId].userIds}] || matchedusers[${rooms[roomId].matchedUserIds}]`)

            const numOfMatchedUsers = rooms[roomId].matchedUserIds.length

            // max 2 authorized users per room
            if (numOfMatchedUsers < 2) {
                rooms[roomId].sockets.push(ws);
                rooms[roomId].userIds.push(userId);
                rooms[roomId].matchedUserIds.push(userId);
            }

            if (numOfMatchedUsers === 2){
                if (!rooms[roomId].matchedUserIds.includes(userId)){
                    console.log(`User ${userId} is denied access to room ${roomId}`);
                    ws.send(JSON.stringify({ type: 'accessDenied', message: 'You are not allowed to access this room.' }));
                    ws.close();
                    return;
                } else {
                    // case: matched user rejoins an un-deleted room
                    rooms[roomId].sockets.push(ws);
                    rooms[roomId].userIds.push(userId);
                }
            }


            // set websocket roomId 
            ws.roomId = roomId;

            console.log(`[ROOM MANAGER] User ${userId} joined room ${roomId}`);
            console.log(`AFTER room Info: userIds[${rooms[roomId].userIds}] || matchedusers[${rooms[roomId].matchedUserIds}]`)


            // notify users of roomId of updated user list to display in frontend
            broadcastUserListUpdate(roomId);
            // notify users of user joining the room 
            broadcastUserJoin(roomId, userId);
            break;

        case "leave":
            handleUserLeave(ws, roomId, userId);
            break;
        default:
            console.error(`Unknown room management type: ${type}`);
            break;
    }

    // Remove user when they disconnect
    ws.on('close', () => {
       handleUserLeave(ws, roomId, userId)
        
    });

    function handleUserLeave(ws, roomId, userId, leaveType) {
        if (ws.hasLeft) return;
        ws.hasLeft = true;

        if (rooms[roomId]) {
            rooms[roomId].sockets = rooms[roomId].sockets.filter(client => client !== ws);
            rooms[roomId].userIds = rooms[roomId].userIds.filter(user => user !== userId);

            console.log(`User ${userId} left room ${roomId}`);

            if (rooms[roomId].sockets.length === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} is empty and deleted`);
            } else {
                broadcastUserListUpdate(roomId);
                broadcastUserLeft(roomId, userId);
            }
        }
    }

    function broadcastUserListUpdate(roomId) {
        const userList = rooms[roomId].userIds;

        rooms[roomId].sockets.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'usersListUpdate', users: userList}));
            }
        })
    }

    function broadcastUserLeft(roomId, userId) {

        rooms[roomId].sockets.forEach((client) => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'userLeft', user: userId}));
            }
        })
    }

    function broadcastUserJoin(roomId, userId) {

        rooms[roomId].sockets.forEach((client) => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'userJoin', user: userId}));
            }
        })
    }


    function broadcastRoomStartTime(ws, roomId) {
        const startTime = rooms[roomId].startTime;

        ws.send(JSON.stringify({
            type: 'roomStartTime',
            startTime: startTime
        }));
    }
}

function getRoom(roomId) {
    return rooms[roomId];
}

function getUsersInRoom(roomId){
    return rooms[roomId]?.userIds || [];
}

module.exports = { manageRoom, getRoom, getUsersInRoom };

