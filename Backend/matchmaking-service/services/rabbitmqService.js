const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';  // URL of RabbitMQ server
const TIMEOUT_DURATION = 30000;  // 30 seconds

async function publishUserToQueue(userId, difficulty, language) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        const exchange = 'matching_exchange';
        const routingKey = 'user.matchmaking';

        await channel.assertExchange(exchange, 'topic', { durable: false });
        
        const message = JSON.stringify({ userId, difficulty, language });
        channel.publish(exchange, routingKey, Buffer.from(message));

        console.log(`User ${userId} sent to queue`);

        // Set up a 30-second timeout for no match found
        setTimeout(async () => {
            console.log(`No match found for ${userId} after 30 seconds, removing from queue`);
            // Send a message back to the frontend via some status update (e.g., WebSocket)
            // You could implement this to notify the frontend or remove from the queue in RabbitMQ
        }, TIMEOUT_DURATION);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing user:', error);
        throw new Error('Failed to publish user');
    }
}

module.exports = { publishUserToQueue };
