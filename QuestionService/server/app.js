const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const questionRouter = require("./controllers/questions")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cs3219.rrxz3.mongodb.net/Question-User-DB?retryWrites=true&w=majority&appName=CS3219`
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/questions', questionRouter)

module.exports = app