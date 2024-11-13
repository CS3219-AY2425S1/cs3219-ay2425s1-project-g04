const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true }
});

const CategoryModel = mongoose.model("Category", CategorySchema, 'Categories');
module.exports = CategoryModel;