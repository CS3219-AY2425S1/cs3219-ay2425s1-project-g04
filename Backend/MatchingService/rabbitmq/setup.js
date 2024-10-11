const amqp = require("amqplib");
const matching_exchange_name = "matching_exchange";
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
]

async function setupRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)

        if (!connection) {
            return;
        }

        const channel = await connection.createChannel();

        // Declare matching exchange to be bind to queues 

        await channel.assertExchange(matching_exchange_name, "topic", { durable: false });

        // Declare dead letter exchange
        const dead_letter_exchange_name = "dead_letter_exchange";
        await channel.assertExchange(dead_letter_exchange_name, "fanout", { durable: false });



        // Create and bind queues to exchange with the routing keys 
        for (let name of queueNames) {
            /*
            try {
                await channel.deleteQueue(name);
            } catch (err) {
                console.log(`Queue ${name} does not exist or could not be deleted: ${err.message}`);
            }
            */
            // this is required to add TTL and dead letter exchange to the queue
            await channel.deleteQueue(name);

            await channel.assertQueue(name, 
                { durable: false, // durable=false ensures queue will survive broker restarts 
                  arguments: {
                    'x-message-ttl': 60000, // set message time to live to 60 seconds
                    'x-dead-letter-exchange': dead_letter_exchange_name // set dead letter exchange
                  }
                
            }); 

            await channel.bindQueue(name, matching_exchange_name, name); // e.g. messages with routing key easy.python goes to easy.python queue
        }

        // Create and bind queue to exchange (if we want only 1 queue) 
        // await channel.assertQueue(name, { durable: false })
        // await channel.bindQueue(name, matching_exchange_name, '#') // all messages go to this queue because of a wildcard pattern

        // Create and bind dead letter queue
        // const dead_letter_queue_name = "dead_letter_queue";
        // await channel.assertQueue(deadLetterQueueName, { durable: false });
        // await channel.bindQueue(deadLetterQueueName, deadLetterExchangeName, ''); // Bind all messages to this queue


        console.log("RabbitMQ setup complete with queues and bindings.")

        await channel.close();
        await connection.close();
    } catch (error) {
        console.log('Error setting up RabbitMQ:', error);
    }
}

module.exports = { setupRabbitMQ, matching_exchange_name, queueNames };

setupRabbitMQ()