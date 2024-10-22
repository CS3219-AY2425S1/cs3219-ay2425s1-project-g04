const amqp = require('amqplib');
const { matching_exchange_name } = require('./setup.js');

let channel = null;  // Store a persistent channel connection

async function connectToRabbitMQ() {
    if (!channel) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            channel = await connection.createChannel();
            console.log("RabbitMQ channel created");
        } catch (error) {
            console.error('Error creating RabbitMQ channel:', error);
        }
    }
    return channel;
}

async function publishToQueue({userId, difficulty, language}) {
    try {
        const channel = await connectToRabbitMQ();  // Reuse persistent connection
        const routingKey = `${difficulty}.${language}`;

        // Publish the message to the exchange
        const messageSent = channel.publish(
            matching_exchange_name,
            routingKey,
            Buffer.from(JSON.stringify({ userId, difficulty, language }))
        );

        if (messageSent) {
            console.log(`Message sent: ${userId} -> ${routingKey}`);
        } else {
            console.error(`Message NOT sent: ${userId} -> ${routingKey}`);
        }
    } catch (error) {
        console.error('Error publishing to RabbitMQ:', error);
    }
}

async function publishCancelRequest({ userId }) {
    try {
        const channel = await connectToRabbitMQ(); // Reuse persistent connection
        const routingKey = 'cancel'; // Define a routing key for cancellation

        // Publish the cancel message to the exchange
        const messageSent = channel.publish(
            matching_exchange_name,
            routingKey,
            Buffer.from(JSON.stringify({ userId }))
        );

        if (messageSent) {
            console.log(`Cancel request sent: ${userId}`);
        } else {
            console.error(`Cancel request NOT sent: ${userId}`);
        }
    } catch (error) {
        console.error('Error publishing cancel request to RabbitMQ:', error);
    }
}

module.exports = { publishToQueue, publishCancelRequest }; 
