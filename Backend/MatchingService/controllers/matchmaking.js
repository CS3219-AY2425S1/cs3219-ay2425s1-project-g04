// WRITE API FOR MATCHING USER, REMEMBER TO DEAL WITH CORS ALLOW ACCESS ORIGIN ERROR
// Cors settled in app.js


const express = require('express');
const router = express.Router();
const { publishToQueue } = require('../rabbitmq/publisher');

// Route for frontend to send user matching info
router.post('/enterMatchmaking', async (req, res) => {
    const { userId, difficulty, language } = req.body;

    try {
        // Publish user info to RabbitMQ
        await publishToQueue({userId: userId, difficulty: difficulty, language: language});
        res.status(200).send('User info sent for matching.');
    } catch (error) {
        console.error('Error publishing user info:', error);
        res.status(500).send('Error in matchmaking process.');
    }
});

// This is for the alternative where the player also listens to a queue after entering matchmaking
/*
router.post('/waitMatch', async (req, res) => {
    try {
        // Start consuming RabbitMQ queues
        // await consumeQueue();
        res.status(200).send('Waiting for match...');
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
        res.status(500).send('Error in matchmaking process.');
    }
})
 */

module.exports = router;