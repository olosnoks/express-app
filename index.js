require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Recipe = require("./recipeModel"); // Assuming recipeModel is still used
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// GET route to fetch all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
});

// GET route to fetch a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// POST route for creating a recipe
app.post('/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    // Basic validation (you can add more as needed)
    if (!title || title.length < 3 || title.length > 100) {
      return res.status(400).json({ message: 'Title must be between 3 and 100 characters.' });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Ingredients must be a non-empty array.' });
    }
    if (!instructions || instructions.length < 10) {
      return res.status(400).json({ message: 'Instructions must be at least 10 characters long.' });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      created_at: Date.now(), // Set the creation date manually
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT route for updating a recipe
app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions } = req.body;

  // Basic validation (you can add more as needed)
  if (!title || title.length < 3 || title.length > 100) {
    return res.status(400).json({ message: 'Title must be between 3 and 100 characters.' });
  }
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: 'Ingredients must be a non-empty array.' });
  }
  if (!instructions || instructions.length < 10) {
    return res.status(400).json({ message: 'Instructions must be at least 10 characters long.' });
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, { title, ingredients, instructions }, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to delete a recipe by ID
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

