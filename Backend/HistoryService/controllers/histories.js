const historyRouter = require('express').Router();
const HistoryModel = require('../models/Histories');

// Assuming Express.js
historyRouter.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const attempts = await HistoryModel.find({ user: userId }); // Fetch by user object ID
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attempt history' });
    }
});


// Post a new history entry when a user exits a session
historyRouter.post("/", async (req, res) => {
    const { user, matchedUsername, questionTitle, startTime, duration, code } = req.body;

    try {
        const newHistory = new HistoryModel({
            user,
            matchedUsername,
            questionTitle,
            startTime,
            duration,
            code
        });

        await newHistory.save();
        res.status(201).json(newHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = historyRouter;
