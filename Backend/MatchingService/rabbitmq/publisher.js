const amqp = require('amqplib');
const { matching_exchange_name } = require('./setup.js');

let channel = null;

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

async function publishToQueue({ userId, difficulty, category }) {
    try {
        const channel = await connectToRabbitMQ();
        const routingKey = `${difficulty}.${category}`;

        const messageSent = channel.publish(
            matching_exchange_name,
            routingKey,
            Buffer.from(JSON.stringify({ userId, difficulty, category }))
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

// async function publishCancelRequest({ userId }) {
//     try {
//         const channel = await connectToRabbitMQ();
//         const routingKey = 'cancel';

//         const messageSent = channel.publish(
//             matching_exchange_name,
//             routingKey,
//             Buffer.from(JSON.stringify({ userId }))
//         );

//         if (messageSent) {
//             console.log(`Cancel request sent: ${userId}`);
//         } else {
//             console.error(`Cancel request NOT sent: ${userId}`);
//         }
//     } catch (error) {
//         console.error('Error publishing cancel request to RabbitMQ:', error);
//     }
// }

// module.exports = { publishToQueue, publishCancelRequest };
module.exports = { publishToQueue };
