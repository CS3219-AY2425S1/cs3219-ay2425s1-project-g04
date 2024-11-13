const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true // The user for whom this history entry is being created
    },
    matchedUsername: { 
        type: String,
        required: true
    },
    questionTitle: {
        type: String,
        required: true
    },
    startTime: {
        type: Date, // Time when the session started
        default: Date.now
    },
    duration: {
        type: Number, // Duration in minutes for the individual user
        required: true
    }
});

// Create the History model
const HistoryModel = mongoose.model('History', HistorySchema, 'History');
module.exports = HistoryModel;
