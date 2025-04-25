var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

// Open SQLite Database
var db = new sqlite3.Database('recipe.sqlite');

/* GET recipes based on query */
router.get('/recipes', function (req, res, next) {
  let query = req.query.q || ''; // Get query parameter (e.g., ?q=tomato)
  
  console.log('Search query:', query); // Add logging
  
  // Split the query by commas to handle multiple ingredients
  const ingredients = query.split(',').map(i => i.trim().toLowerCase());
  
  // Prepare the SQL query to search for recipes
  db.all("SELECT * FROM recipe", [], function (err, rows) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Error fetching recipes", error: err });
    }
    
    console.log(`Found ${rows.length} total recipes`); // Add logging
    
    // Filter recipes that contain any of the requested ingredients
    const matchingRecipes = rows.filter(recipe => {
      if (!recipe.Ingredients) return false;
      const recipeIngredients = recipe.Ingredients.toLowerCase();
      
      return ingredients.some(ingredient => 
        recipeIngredients.includes(ingredient)
      );
    });
    
    console.log(`Found ${matchingRecipes.length} matching recipes`); // Add logging

    // Send the list of recipes as JSON
    res.json({ message: "Here's a list of recipes!", recipes: matchingRecipes });
  });
});

module.exports = router;
