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
        // create queue if it does not exist, make it false so that if no subscriber queue is still persistent in server
        channel.assertQueue(queueName, {
            durable: false
        })

        channel.consume(queueName, (message) => {
            console.log(`Received: ${message.content.toString()}`);
            channel.ack(message);
        }, //{
            // will pass acknowledge to every message implicitly
            //noAck: true
        //}
        )

    })
})
