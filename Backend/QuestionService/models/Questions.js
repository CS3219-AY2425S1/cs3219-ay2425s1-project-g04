// Create Question Model Here 
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: {
        type: [String],
        required: [true, "Category is required. "],
        validate: {
            validator: function (v) {
                return v.length > 0; 
            },
            message: "Category cannot be empty. "
        },
    },
    complexity: {
        type: String,
        required: [true, "Please indicate the level of complexity. "]
    },
    description: {
        type: String,
        required: [true, "Description is required. "],
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0; 
            },
            message: "Description cannot be empty. "
        }
    },
    id: Number,
    title: {
        type: String,
        required: [true, "Title is required. "],
        unique: true,
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0; 
            },
            message: "Title cannot be empty. "
        }
    }
});


// We create a model with the name 'Question', a schema 'QuestionSchema', and specifically looking at 'Questions' cluster in
// the 'Question-DB' database 
const QuestionModel = mongoose.model('Question', QuestionSchema, 'Questions');
module.exports = QuestionModel;