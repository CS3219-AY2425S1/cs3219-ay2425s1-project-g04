const amqp = require('amqplib');

async function publishUserToQueue(userId, difficulty, language) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'matching_exchange';
        await channel.assertExchange(exchange, 'topic', { durable: false });

        const message = JSON.stringify({ userId, difficulty, language });
        const routingKey = 'user.matchmaking'; // single routing key for all messages

        channel.publish(exchange, routingKey, Buffer.from(message));

        console.log(`User ${userId} sent to matchmaking queue with difficulty ${difficulty} and language ${language}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing user:', error);
    }
}

// Capture user input from command line
const userId = process.argv[2];
const difficulty = process.argv[3];
const language = process.argv[4];

if (!userId || !difficulty || !language) {
    console.error('Usage: node publisher.js <userId> <difficulty> <language>');
    process.exit(1);
}

publishUserToQueue(userId, difficulty, language);
