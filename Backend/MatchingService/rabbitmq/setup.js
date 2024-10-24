const amqp = require("amqplib");
const generator = require("../utils/generateQueues");

const matching_exchange_name = "matching_exchange";
const dead_letter_exchange_name = "dead_letter_exchange";
const dead_letter_queue_name = "dead_letter_queue";
const cancel_queue_name = "cancel_queue";
const difficulties = ["easy", "medium", "hard"];
const languages = ["python", "java", "cplusplus"];

const queueNames = generator.generateQueueNames(
    generator.generateCombinations(difficulties, languages)
);

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);

        if (!connection) {
            return;
        }

        const channel = await connection.createChannel();

        // Declare the matching exchange (topic)
        await channel.assertExchange(matching_exchange_name, "topic", { durable: true });

        // Declare the dead-letter exchange (fanout)
        await channel.assertExchange(dead_letter_exchange_name, "fanout", { durable: true });

        // Declare and bind all main queues with TTL and DLQ bindings
        for (let queueName of queueNames) {
            await channel.deleteQueue(queueName);  // Ensure we start fresh for each setup

            await channel.assertQueue(queueName, {
                durable: true, 
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
        await channel.assertQueue(dead_letter_queue_name, { durable: true });
        await channel.bindQueue(dead_letter_queue_name, dead_letter_exchange_name, ''); // Bind with no routing key

        // Declare and bind the cancel queue
        await channel.deleteQueue(cancel_queue_name);  // Delete any existing cancel queue
        await channel.assertQueue(cancel_queue_name, { durable: true }); // Declare the cancel queue
        await channel.bindQueue(cancel_queue_name, matching_exchange_name, 'cancel'); // Bind with the "cancel" routing key

        console.log("RabbitMQ setup complete with queues, DLQ, and bindings.");

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error setting up RabbitMQ:", error);
    }
}

module.exports = { setupRabbitMQ, matching_exchange_name, queueNames, dead_letter_queue_name , cancel_queue_name};