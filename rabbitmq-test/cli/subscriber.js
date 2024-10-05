const amqp = require('amqplib');

async function consumeQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = process.argv[2] || 'matching_exchange';
        const queue = process.argv[3] || 'matchmaking_queue';

        await channel.assertExchange(exchange, 'topic', { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, 'user.matchmaking');

        console.log('Waiting for users in matchmaking queue...');

        const onMessage = (msg) => {
            const content = JSON.parse(msg.content.toString());
            const { userId, difficulty, language } = content;
            console.log(`Received user ${userId} for ${difficulty} difficulty and ${language} language`);

            // Call the matchUsers function with difficulty and language filtering
            matchUsers(userId, difficulty, language);

            channel.ack(msg);
        };

        channel.consume(queue, onMessage);
    } catch (error) {
        console.error('Error consuming queue:', error);
    }
}

// Start consuming
consumeQueue();

let users = [];  // Array to hold all users
let timeouts = {};

function matchUsers(userId, difficulty, language) {
    // Find potential matches by filtering users by difficulty and language
    const potentialMatch = users.find(user => user.difficulty === difficulty && user.language === language);

    if (potentialMatch && potentialMatch.userId !== userId) {
        console.log(`Matched ${userId} with ${potentialMatch.userId} on ${difficulty} difficulty and ${language} language`);

        // Clear timeouts for matched users
        clearTimeout(timeouts[userId]);
        clearTimeout(timeouts[potentialMatch.userId]);

        // Remove the matched users from the queue
        users = users.filter(user => user.userId !== userId && user.userId !== potentialMatch.userId);

        // Remove users' timeouts from the timeout array
        delete timeouts[userId];
        delete timeouts[potentialMatch.userId];

        // Additional logic for matched users
    } else {
        // Add the user to the list if no match is found
        users.push({ userId, difficulty, language });
        console.log(`Added user ${userId} to queue for ${difficulty} difficulty and ${language} language`);

        // Start timeout for unmatched users
        timeouts[userId] = setTimeout(() => {
            console.log(`User ${userId} timed out after waiting for a match`);
            users = users.filter(user => user.userId !== userId);
            delete timeouts[userId];
        }, 60000); // Timeout after 1 minute
    }
}
