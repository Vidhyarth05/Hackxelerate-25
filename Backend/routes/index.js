var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

// Open SQLite Database
var db = new sqlite3.Database('recipe.sqlite');

/* GET recipes based on query */
router.get('/recipes', function (req, res, next) {
  let query = req.query.q || ''; // Get query parameter (e.g., ?q=tomato)

  // Prepare the SQL query to search for recipes
  db.all("SELECT * FROM recipe WHERE RecipeName LIKE ?", ['%' + query + '%'], function (err, rows) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Error fetching recipes", error: err });
    }
    // Send the list of recipes as JSON
    res.json({ message: "Here's a list of recipes!", recipes: rows });
  });
});

module.exports = router;
