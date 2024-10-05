const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const matchmakingRouter = require("./controllers/matchmaking");

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// Set up matchmaking routes
app.use('/api/matchmaking', matchmakingRouter);

module.exports = app;
