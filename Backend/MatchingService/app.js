const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
//const matchmakingRouter = require("./controllers/matchmaking");
//const { consumeQueue } = require('./rabbitmq/subscriber');
//const { setupRabbitMQ } = require('./rabbitmq/setup');
//const { publishToQueue } = require('./rabbitmq/publisher')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/match', matchmakingRouter);

// TODO: Start consuming RabbitMQ queues 
/*
setupRabbitMQ().then(() => {

    consumeQueue().catch(console.error);
    publishToQueue("user_234", "easy", "python")
    publishToQueue("user_100", "easy", "java")

})
*/

module.exports = app;