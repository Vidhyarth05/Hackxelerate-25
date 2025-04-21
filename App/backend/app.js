var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

// Initialize the express app
var app = express();

// Use middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS middleware - THIS IS IMPORTANT
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use the SQLite database
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./recipe.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Recipe search route 
// In app.js - update the recipe search route
app.get('/recipes', (req, res) => {
  const ingredientQuery = req.query.q;

  if (!ingredientQuery) {
    return res.status(400).json({ message: 'No ingredient provided' });
  }
  
  // Split the query string by commas to get individual ingredients
  const ingredients = ingredientQuery.split(',').map(i => i.trim().toLowerCase());
  
  // Get all recipes
  db.all("SELECT * FROM recipe", [], (err, allRecipes) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    // Filter recipes that contain ALL of the user's ingredients
    const matchingRecipes = allRecipes.filter(recipe => {
      const recipeIngredients = recipe.Ingredients.toLowerCase();
      // Check if ALL requested ingredients are in this recipe
      return ingredients.every(ingredient => 
        recipeIngredients.includes(ingredient)
      );
    });

    if (matchingRecipes.length === 0) {
      return res.json({ message: 'No recipes found', recipes: [] });
    }

    return res.json({ message: "Here's a list of recipes!", recipes: matchingRecipes });
  });
});

// In your Express app.js - add this route
app.post('/donate', (req, res) => {
  const { foodItem, contactInfo, notes } = req.body;
  
  // Create donations table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    foodItem TEXT,
    contactInfo TEXT,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating donations table:', err);
      return res.status(500).json({ error: 'Failed to create donations table' });
    }
    
    // Insert the donation
    db.run(`INSERT INTO donations (foodItem, contactInfo, notes) VALUES (?, ?, ?)`, 
      [foodItem, contactInfo, notes], (err) => {
        if (err) {
          console.error('Error adding donation:', err);
          return res.status(500).json({ error: 'Failed to add donation' });
        }
        res.json({ message: "Donation added successfully!" });
      });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;