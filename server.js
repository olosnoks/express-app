require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  image: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Routes

// GET all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// POST new recipe
app.post('/recipes', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newRecipe = new Recipe({
      title,
      ingredients: ingredients.split(',').map(i => i.trim()),
      instructions,
      image
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(400).json({ error: 'Failed to add recipe' });
  }
});

// Catch-all route for SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
