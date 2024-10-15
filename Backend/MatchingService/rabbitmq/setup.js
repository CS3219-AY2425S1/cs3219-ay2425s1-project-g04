const amqp = require("amqplib");

const matching_exchange_name = "matching_exchange";
const dead_letter_exchange_name = "dead_letter_exchange";
const dead_letter_queue_name = "dead_letter_queue";
const queueNames = [
    'easy.python',
    'easy.java',
    'easy.cplusplus',
    'medium.python',
    'medium.java',
    'medium.cplusplus',
    'hard.python',
    'hard.java',
    'hard.cplusplus'
];

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);

        if (!connection) {
            return;
        }

        const channel = await connection.createChannel();

        // Declare the matching exchange (topic)
        await channel.assertExchange(matching_exchange_name, "topic", { durable: false });

        // Declare the dead-letter exchange (fanout)
        await channel.assertExchange(dead_letter_exchange_name, "fanout", { durable: false });

        // Declare and bind all main queues with TTL and DLQ bindings
        for (let queueName of queueNames) {
            await channel.deleteQueue(queueName);  // Ensure we start fresh for each setup

            await channel.assertQueue(queueName, {
                durable: false, 
                arguments: {
                    'x-message-ttl': 10000,  // 60 seconds TTL
                    'x-dead-letter-exchange': dead_letter_exchange_name  // Bind to dead-letter exchange
                }
            });

            await channel.bindQueue(queueName, matching_exchange_name, queueName); // Bind to exchange
        }

        // Delete DLQ before asserting it
        await channel.deleteQueue(dead_letter_queue_name);

        // Declare the dead-letter queue and bind it to the dead-letter exchange
        await channel.assertQueue(dead_letter_queue_name, { durable: false });
        await channel.bindQueue(dead_letter_queue_name, dead_letter_exchange_name, ''); // Bind with no routing key

        console.log("RabbitMQ setup complete with queues, DLQ, and bindings.");

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error setting up RabbitMQ:", error);
    }
}

module.exports = { setupRabbitMQ, matching_exchange_name, queueNames, dead_letter_queue_name };
