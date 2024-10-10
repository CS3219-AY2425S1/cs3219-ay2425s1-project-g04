const amqp = require('amqplib');

// TODO: Subscribe and acknowledge messages with user info when timeout/user matched

//const { matchUsers } = require('../services/matchingService');

/*
async function consumeQueue() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const exchange = 'matching_exchange';

        // Consuming messages from multiple queues (already created in setup)
        const queueNames = ['easy.python', 'easy.java', 'medium.python', 'medium.java', 'hard.python', 'hard.java'];

        console.log("Waiting for users...")

        for (let queueName of queueNames) {
            channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    const userData = JSON.parse(msg.content.toString());
                    // const { userId, language, difficulty } = userData;

                    // Perform the matching logic
                    // matchUsers(userId, language, difficulty);
                    console.log(userData);

                    channel.ack(msg);
                }
            });
        }
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

*/
