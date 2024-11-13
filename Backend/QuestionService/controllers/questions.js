const questionsRouter = require('express').Router()
const QuestionModel = require('../models/Questions')

questionsRouter.get("/by-category-and-complexity", async (req, res) => {
    let { category, complexity } = req.query;
    try {
        const query = {}
        category = category.replace(/-/g, " ");
        query.category = { $in: [new RegExp(`^${category}$`, "i")] };
        query.complexity = { $in: [new RegExp(`^${complexity}$`, "i")] };

        const questions = await QuestionModel.find(query);
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions by category & complexity:", error);
        res.status(500).json({ error: error.message });
    }
});

questionsRouter.get("/by-category", async (req, res) => {
    const { category } = req.query;
    try {
        const query = category ? { category: { $in: [new RegExp(`^${category}$`, "i")] } } : {};
        const questions = await QuestionModel.find(query);
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions by category:", error);
        res.status(500).json({ error: error.message });
    }
});

// Read all questions
questionsRouter.get("/", async (req, res) => {
    try {
        const questions = await QuestionModel.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Create a new question
questionsRouter.post("/", async (req, res) => {
  console.log('Incoming Data:', req.body)
  try {
      const maxQuestion = await QuestionModel.findOne().sort({ id: -1 }).exec()
      const maxId = maxQuestion ? maxQuestion.id : 0

      const newQuestion = new QuestionModel({
          category: req.body.category,
          complexity: req.body.complexity,
          description: req.body.description,
          id: maxId + 1,
          title: req.body.title
      })

      // Save the new question
      await newQuestion.save()
      res.status(201).json(newQuestion)
  } catch (error) {
      if (error.code === 11000) {
          // Check for duplicate key in MongoDB
          return res.status(400).json({ error: "This title is already in use." })
      } else if (error.name === "ValidationError" || error.name === "CastError") {
          const errors = Object.values(error.errors).map(err => err.message)
          return res.status(400).json({ error: errors })
      }
      res.status(500).json({ error: error.message })
  }
})

// Read a specific question 
questionsRouter.get("/:id", async (req, res) => {

    const id = req.params.id;

    console.log("Fetching Question with ID:", id);

    try {
        const question = await QuestionModel.findById(id);

        if (!question) {
            return res.status(404).json({error: 'Question not found'});
        }
        console.log("Data found: ", question);
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

questionsRouter.put("/:id", async (req, res) => {
    try {
        const question = await QuestionModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ error: "Question not found" });
        res.status(200).json(question);
    } catch (error) {
        
        if (error.code === 11000) {
            // Check for duplicate key in MongoDB
            return res.status(400).json({ error: "This title is already in use. " });
        } else if (error.name === "ValidationError" || error.name === "CastError" ) {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors });
        }
        res.status(500).json({ error: error.message });
    }
});


// Delete a question 
questionsRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const question = await QuestionModel.findByIdAndDelete({_id: id});
        if (!question) {
            return res.status(404).json({error: 'Question not found '});
        }
        res.status(200).json({message: 'Question deleted'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = questionsRouter





