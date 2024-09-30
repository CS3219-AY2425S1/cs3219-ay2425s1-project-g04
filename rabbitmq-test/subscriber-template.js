const amqp = require('amqplib');

// Store the queue contents for each difficulty
let easyUsers = [];
let mediumUsers = [];
let hardUsers = [];

// Store the timeouts for each difficulty
let easyTimeouts = {};
let mediumTimeouts = {};
let hardTimeouts = {};

// Timeout function that removes users after 1 minute if not matched
function timeoutUser(userId, difficulty) {
    console.log(`User ${userId} in ${difficulty} queue timed out`);
    
    // Remove the user from the respective array
    if (difficulty === 'easy') {
        easyUsers = easyUsers.filter(user => user !== userId);
        delete easyTimeouts[userId];
    } else if (difficulty === 'medium') {
        mediumUsers = mediumUsers.filter(user => user !== userId);
        delete mediumTimeouts[userId];
    } else if (difficulty === 'hard') {
        hardUsers = hardUsers.filter(user => user !== userId);
        delete hardTimeouts[userId];
    }

    // Notify the user about the timeout
    console.log(`User ${userId} removed from ${difficulty} queue due to timeout`);
}

// Function to match users in each queue
function matchUsers(userArray, timeoutArray, difficulty) {
    // Check if we have two distinct users to match
    if (userArray.length >= 2) {
        const [user1, user2] = userArray;

        if (user1 !== user2) { // Ensure the users are distinct
            console.log(`Matched ${user1} with ${user2} in ${difficulty} difficulty`);

            // Clear timeouts for matched users
            clearTimeout(timeoutArray[user1]);
            clearTimeout(timeoutArray[user2]);

            // Reset the array after matching
            userArray.splice(0, 2); // Remove the matched users

            // Remove users' timeouts from the timeout array
            delete timeoutArray[user1];
            delete timeoutArray[user2];

            // Redirect users to the collaborative space (e.g., notify via WebSockets)
            // Additional code for handling the matched users goes here...
        } else {
            console.log("Cannot match a user with themselves.");
        }
    }
}

// Function to consume a queue for a specific difficulty with timeout
async function consumeQueue(difficulty) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare the exchange and queue for the specific difficulty
        const exchange = 'matching_exchange';
        const queue = `difficulty.${difficulty}`;

        await channel.assertExchange(exchange, 'topic', { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, `difficulty.${difficulty}`);

        console.log(`Waiting for messages in ${queue} queue...`);

        // Consumer function based on difficulty
        const onMessage = (msg) => {
            const userId = msg.content.toString();
            console.log(`Received user: ${userId} for ${difficulty} difficulty`);

            // Ensure that the user is not already in the queue
            if ((difficulty === 'easy' && !easyUsers.includes(userId)) ||
                (difficulty === 'medium' && !mediumUsers.includes(userId)) ||
                (difficulty === 'hard' && !hardUsers.includes(userId))) {

                // Add users to the appropriate array based on difficulty and start timeout
                if (difficulty === 'easy') {
                    easyUsers.push(userId);
                    // set the timeout to 1 minute
                    easyTimeouts[userId] = setTimeout(() => timeoutUser(userId, 'easy'), 60000);
                    matchUsers(easyUsers, easyTimeouts, difficulty);
                } else if (difficulty === 'medium') {
                    mediumUsers.push(userId);
                    // set the timeout to 1 minute
                    mediumTimeouts[userId] = setTimeout(() => timeoutUser(userId, 'medium'), 60000);
                    matchUsers(mediumUsers, mediumTimeouts, difficulty);
                } else if (difficulty === 'hard') {
                    hardUsers.push(userId);
                    // set the timeout to 1 minute
                    hardTimeouts[userId] = setTimeout(() => timeoutUser(userId, 'hard'), 60000);
                    matchUsers(hardUsers, hardTimeouts, difficulty);
                }
            } else {
                // do not add to the same queue twice
                console.log(`User ${userId} is already in the ${difficulty} queue. Ignoring duplicate.`);
            }

            // Acknowledge the message to remove the message from queue 
            channel.ack(msg);
        };

        // Start consuming the queue with the function onMessage 
        channel.consume(queue, onMessage);
    } catch (error) {
        console.error('Error consuming queue:', error);
    }
}

// Listening for matches in the 'easy', 'medium', and 'hard' queues
consumeQueue('easy');
consumeQueue('medium');
consumeQueue('hard');

