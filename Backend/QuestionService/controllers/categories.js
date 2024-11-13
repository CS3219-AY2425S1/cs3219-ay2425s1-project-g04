const categoriesRouter = require('express').Router();
const CategoryModel = require('../models/Categories');

// Read all categories
categoriesRouter.get("/", async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create multiple categories
categoriesRouter.post("/", async (req, res) => {
    console.log('Incoming Data for category:', req.body)
    // if (!Array.isArray(categories)) {
    //     console.log("error in API POST")
    //     return res.status(400).json({ error: 'Expected an array of categories' });
    // }

    try {
        console.log("in POST api")
        const createdCategories = []; 
        for (const categoryName of req.body) {
            const newCategory = new CategoryModel({ name: categoryName });
            const savedCategory = await newCategory.save();
            createdCategories.push(savedCategory);
        }
        res.status(201).json(createdCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete a category by name
categoriesRouter.delete("/:name", async (req, res) => {
    const name = req.params.name;

    try {
        const category = await CategoryModel.findOneAndDelete({ name });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = categoriesRouter;
