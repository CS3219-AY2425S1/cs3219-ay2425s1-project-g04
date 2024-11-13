const amqp = require("amqplib");
const generator = require("../utils/generateQueues");

const matching_exchange_name = "matching_exchange";
const dead_letter_exchange_name = "dead_letter_exchange";
const dead_letter_queue_name = "dead_letter_queue";
// const cancel_queue_name = "cancel_queue";
const difficulties = ["easy", "medium", "hard", "any"];
const axios = require('axios');
// Matching Service code
// const questionServiceHost = process.env.QUESTION_SERVICE_HOST || 'localhost';
const categoryAPIUrl = `http://34.120.84.41/api/categories`;

let queueNamesPromise = axios.get(categoryAPIUrl)
    .then(response => {
        const categories = response.data.map(category => category.name.toLowerCase().replace(/\s+/g, '-')); 
        console.log("categories from api: ", categories)
        return generator.generateQueueNames(generator.generateCombinations(difficulties, categories));
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
        return []; // Return an empty array if categories couldn't be fetched
    });

async function setupRabbitMQ() {
    try {
        const queueNames = await queueNamesPromise;
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
            await channel.deleteQueue(queueName); // Ensure we start fresh for each setup

            await channel.assertQueue(queueName, {
                durable: true, 
                arguments: {
                    'x-message-ttl': 30000, // TTL for messages in the queue
                    'x-dead-letter-exchange': dead_letter_exchange_name // Bind to dead-letter exchange
                }
            });

            await channel.bindQueue(queueName, matching_exchange_name, queueName); // Bind to exchange
        }

        // Delete and recreate the DLQ
        await channel.deleteQueue(dead_letter_queue_name);
        await channel.assertQueue(dead_letter_queue_name, { durable: true });
        await channel.bindQueue(dead_letter_queue_name, dead_letter_exchange_name, ''); // Bind with no routing key

        // // Delete and recreate the cancel queue
        // await channel.deleteQueue(cancel_queue_name);
        // await channel.assertQueue(cancel_queue_name, { durable: true });
        // await channel.bindQueue(cancel_queue_name, matching_exchange_name, 'cancel'); // Bind with the "cancel" routing key

        console.log("RabbitMQ setup complete with queues, DLQ, and bindings.");

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error setting up RabbitMQ:", error);
    }
}

// module.exports = { setupRabbitMQ, matching_exchange_name, queueNamesPromise, dead_letter_queue_name, cancel_queue_name };
module.exports = { setupRabbitMQ, matching_exchange_name, queueNamesPromise, dead_letter_queue_name };
