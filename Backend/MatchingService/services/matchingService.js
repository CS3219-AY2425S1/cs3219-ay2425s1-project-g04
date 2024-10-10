// TODO: Matching users logic


/*
const { notifyUsers } = require('./websocket/websocket) 
const waitingUsers = {};

function matchUsers(userId, language, difficulty) {
    const criteriaKey = `${difficulty}.${language}`;

    if (!waitingUsers[criteriaKey]) {
        waitingUsers[criteriaKey] = [];
    }

    waitingUsers[criteriaKey].push(userId);
    console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

    // Check if there are 2 or more users waiting for this criteria
    if (waitingUsers[criteriaKey].length >= 2) {
        const matchedUsers = waitingUsers[criteriaKey].splice(0, 2); // Match the first two users
        console.log(`Matched users: ${matchedUsers}`);
        
        // Send match success (this could trigger WebSocket communication)
        notifyUsers(matchedUsers);
        return true;
    }

    return false;
}

module.exports = { matchUsers };
*/