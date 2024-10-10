const amqp = require('amqplib');
// TODO: Write function to publish to rabbitMQ 

/*
async function publishToQueue(userId, difficulty, language) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const matching_exchange_name = 'matching_exchange';
        const routingKey = `${difficulty}.${language}`;
        const queueName = `${difficulty}.${language}`;

        if (queueInfo) {
            channel.publish(matching_exchange_name, routingKey, Buffer.from(JSON.stringify({ userId, language, difficulty })));

            console.log(`Published user: ${userId} with routing key: ${routingKey}`);
        } else {
            console.log(`Cannot publish message: Queue ${queueName} does not exist`);
        }
        
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing to RabbitMQ:', error);
    }
}

module.exports = { publishToQueue };
*/






