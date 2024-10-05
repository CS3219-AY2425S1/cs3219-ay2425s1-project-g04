// const express = require('express');
// const bodyParser = require('body-parser');
// const amqp = require('amqplib/callback_api');
// require('dotenv').config(); // Load environment variables

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware to parse request body
// app.use(bodyParser.json());

// // RabbitMQ connection details from .env
// const rabbitMQHost = process.env.RABBITMQ_HOST;
// const rabbitMQPort = process.env.RABBITMQ_PORT;
// const rabbitMQUser = process.env.RABBITMQ_USER;
// const rabbitMQPassword = process.env.RABBITMQ_PASSWORD;
// const rabbitMQQueue = process.env.RABBITMQ_QUEUE || 'match_queue';

// // RabbitMQ connection
// let channel = null;
// amqp.connect(`amqp://${rabbitMQUser}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}`, (err, conn) => {
//   if (err) {
//     console.error('Failed to connect to RabbitMQ:', err);
//     process.exit(1);
//   }

//   conn.createChannel((err, ch) => {
//     if (err) {
//       console.error('Failed to create channel:', err);
//       process.exit(1);
//     }

//     ch.assertQueue(rabbitMQQueue, { durable: false });
//     channel = ch;
//     console.log('RabbitMQ connected and channel created.');
//   });
// });

// // Matchmaking endpoint
// app.post('/match', (req, res) => {
//   const { username, difficulty, language } = req.body;

//   if (!username || !difficulty || !language) {
//     return res.status(400).json({ message: 'Missing required fields.' });
//   }

//   const user = { username, difficulty, language };
  
//   // Push user into RabbitMQ queue
//   if (channel) {
//     channel.sendToQueue(rabbitMQQueue, Buffer.from(JSON.stringify(user)));
//     console.log(`User pushed into queue: ${JSON.stringify(user)}`);
//     res.status(200).json({ message: 'User pushed into matchmaking queue.' });
//   } else {
//     res.status(500).json({ message: 'RabbitMQ connection error.' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const matchmakingRouter = require('express').Router();
const rabbitmqService = require('../services/rabbitmqService');

// Post a user to the matchmaking queue
matchmakingRouter.post("/api/matchmaking", async (req, res) => {
    const { userId, difficulty, language } = req.body;
    if (!userId || !difficulty || !language) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Call the RabbitMQ service to publish the user to the queue
        await rabbitmqService.publishUserToQueue(userId, difficulty, language);
        return res.status(200).json({ message: `User ${userId} added to matchmaking queue` });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error adding user to matchmaking queue' });
    }
});

module.exports = matchmakingRouter;
