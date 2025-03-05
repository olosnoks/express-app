const Joi = require('joi');

// Validation schema for recipe data
const recipeSchema = Joi.object({
// Title is required and at least 3 characters long
    title: Joi.string().min(3).required(), 
// Ingredients are required and should be an array of strings
    ingredients: Joi.array().items(Joi.string().required()).required(), 
// Instructions should be at least 10 characters long
    instructions: Joi.string().min(10).required(), 
// Optional image field that must be a valid URI if provided
    image: Joi.string().uri().optional(), 
});

module.exports = recipeSchema;
