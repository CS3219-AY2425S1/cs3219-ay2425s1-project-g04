// advanced messaging queue protocol library, get response in callback
const amqp = require('amqplib/callback_api')

amqp.connect(`amqp://localhost`, (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        let queueName = "technical";
        let message = "This is Qiao en!"
        // create queue if it does not exist, make it false so that if no subscriber queue is still persistent in server
        channel.assertQueue(queueName, {
            durable: false
        })
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message: ${message}`);
        // close connection after 1 second 
        setTimeout(() => {
            connection.close();
        }, 1000)

    })
})


