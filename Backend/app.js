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
app.get('/recipes', (req, res) => {
  const ingredient = req.query.q;

  if (!ingredient) {
    return res.status(400).json({ message: 'No ingredient provided' });
  }

  const query = `SELECT * FROM recipe WHERE Ingredients LIKE ?`;

  db.all(query, [`%${ingredient}%`], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.json({ message: 'No recipes found', recipes: [] });
    }

    return res.json({ message: "Here's a list of recipes!", recipes: rows });
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