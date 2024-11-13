const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const questionRouter = require("./controllers/questions")
const categoriesRouter = require("./controllers/categories");

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cs3219.rrxz3.mongodb.net/Question-DB?retryWrites=true&w=majority&appName=CS3219`
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/questions', questionRouter)
app.use('/api/categories', categoriesRouter);

app.get("/", (req, res, next) => {
    console.log("Sending Greetings!");
    res.json({
      message: "Hello World from question-service",
    });
  });
  
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Handle When No Route Match Is Found
app.use((req, res, next) => {
    const error = new Error("Route Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
});

module.exports = app