// TODO: WRITE API FOR MATCHING USER, REMEMBER TO DEAL WITH CORS ALLOW ACCESS ORIGIN ERROR

/*
const express = require('express');
const router = express.Router();
const { publishToQueue } = require('../rabbitmq/publisher');

// Route for frontend to send user matching info
router.post('/match', async (req, res) => {
    const { userId, language, difficulty } = req.body;

    try {
        // Publish user info to RabbitMQ
        await publishToQueue(userId, language, difficulty);
        res.status(200).send('User info sent for matching.');
    } catch (error) {
        console.error('Error publishing user info:', error);
        res.status(500).send('Error in matchmaking process.');
    }
});

module.exports = router;
*/