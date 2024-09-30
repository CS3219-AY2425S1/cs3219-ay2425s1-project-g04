const amqp = require('amqplib');

async function publishUserToQueue(userId, difficulty) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare exchange of type topic for routing by difficulty
        const exchange = 'matching_exchange';
        await channel.assertExchange(exchange, 'topic', {durable:false});

        const routingKey = `difficulty.${difficulty}`;

        channel.publish(exchange, routingKey, Buffer.from(userId));

        console.log(`User ${userId} sent to ${routingKey}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing user:', error);
    }
}

publishUserToQueue('user_457', 'hard');