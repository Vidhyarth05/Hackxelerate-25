var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var bcrypt = require('bcrypt');

// Initialize the express app
var app = express();

// Use middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Use the SQLite database
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./recipe.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database');
    
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      email TEXT,
      userType TEXT DEFAULT 'normal',
      points INTEGER DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, async (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
        
        // Check if admin user exists, if not create one
        db.get("SELECT * FROM users WHERE userType = 'admin'", async (err, row) => {
          if (err) {
            console.error('Error checking for admin:', err);
          } else if (!row) {
            // Create admin user if none exists
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.run(
              "INSERT INTO users (username, password, name, userType) VALUES (?, ?, ?, ?)",
              ['admin', hashedPassword, 'Administrator', 'admin'],
              (err) => {
                if (err) {
                  console.error('Error creating admin user:', err);
                } else {
                  console.log('Admin user created');
                }
              }
            );
          }
        });
      }
    });

    // Create NGO requests table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS ngo_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      ngoDetails TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating ngo_requests table:', err);
      } else {
        console.log('NGO requests table ready');
      }
    });

    // Create donations table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodItem TEXT,
      contactInfo TEXT,
      notes TEXT,
      userId INTEGER,
      status TEXT DEFAULT 'pending',
      acceptedBy INTEGER,
      acceptedAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (acceptedBy) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating donations table:', err);
      } else {
        console.log('Donations table ready');
      }
    });
  }
});

// Recipe search route
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
// Donation route
app.post('/donate', (req, res) => {
  const { foodItem, contactInfo, notes } = req.body;
  const userId = req.body.userId || null; // Get userId if available
  
  // Insert the donation
  db.run(`INSERT INTO donations (foodItem, contactInfo, notes, userId) VALUES (?, ?, ?, ?)`,
    [foodItem, contactInfo, notes, userId], (err) => {
    if (err) {
      console.error('Error adding donation:', err);
      return res.status(500).json({ error: 'Failed to add donation' });
    }

    res.json({ message: "Donation added successfully!" });
  });
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, userType = 'normal' } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      db.run(
        "INSERT INTO users (username, password, name, email, userType) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, name, email, userType],
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Failed to create user' });
          }
          
          res.status(201).json({ 
            message: 'User created successfully',
            userId: this.lastID
          });
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  // Find user
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Compare password
    try {
      const match = await bcrypt.compare(password, user.password);
      
      if (!match) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Remove password from response
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      res.json({ 
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Password comparison error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Get user profile
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  
  db.get("SELECT id, username, name, email, userType, points, createdAt FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  });
});

// Update user type (admin only)
app.put('/users/:id/type', (req, res) => {
  const userId = req.params.id;
  const { userType, adminId } = req.body;
  
  if (!['normal', 'ngo', 'admin'].includes(userType)) {
    return res.status(400).json({ message: 'Invalid user type' });
  }
  
  // Verify admin
  db.get("SELECT * FROM users WHERE id = ? AND userType = 'admin'", [adminId], (err, admin) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
    }
    
    // Update user type
    db.run("UPDATE users SET userType = ? WHERE id = ?", [userType, userId], function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: 'Failed to update user type' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User type updated successfully' });
    });
  });
});

// Change password
app.put('/users/change-password', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    // Find user
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const match = await bcrypt.compare(currentPassword, user.password);
      
      if (!match) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      db.run("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username], function(err) {
        if (err) {
          console.error('Password update error:', err);
          return res.status(500).json({ message: 'Failed to update password' });
        }
        
        res.json({ message: 'Password updated successfully' });
      });
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// NGO Request routes
app.post('/ngo-request', async (req, res) => {
  try {
    const { userId, ngoDetails } = req.body;
    
    // Check if user exists
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user already has a pending request
      db.get("SELECT * FROM ngo_requests WHERE userId = ? AND status = 'pending'", [userId], (err, existingRequest) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        if (existingRequest) {
          return res.status(400).json({ message: 'You already have a pending NGO request' });
        }
        
        // Insert new NGO request
        db.run(
          "INSERT INTO ngo_requests (userId, ngoDetails) VALUES (?, ?)",
          [userId, JSON.stringify(ngoDetails)],
          function(err) {
            if (err) {
              console.error('Error creating NGO request:', err);
              return res.status(500).json({ message: 'Failed to submit NGO request' });
            }
            
            res.status(201).json({ 
              message: 'NGO request submitted successfully',
              requestId: this.lastID
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('NGO request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO request status for a user
app.get('/ngo-request/status/:userId', (req, res) => {
  const userId = req.params.userId;
  
  db.get("SELECT status FROM ngo_requests WHERE userId = ? ORDER BY createdAt DESC LIMIT 1", [userId], (err, request) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!request) {
      return res.json({ status: null });
    }
    
    res.json({ status: request.status });
  });
});

// Get all NGO requests (admin only)
app.get('/ngo-requests', (req, res) => {
  // In a real app, you would verify the admin status here
  
  db.all(`
    SELECT r.id, r.userId, r.ngoDetails, r.status, r.createdAt, u.username 
    FROM ngo_requests r
    JOIN users u ON r.userId = u.id
    WHERE r.status = 'pending'
    ORDER BY r.createdAt DESC
  `, [], (err, requests) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Parse the ngoDetails JSON for each request
    const formattedRequests = requests.map(request => ({
      ...request,
      ngoDetails: JSON.parse(request.ngoDetails)
    }));
    
    res.json(formattedRequests);
  });
});

// Approve NGO request (admin only)
app.put('/ngo-request/approve/:requestId', (req, res) => {
  const requestId = req.params.requestId;
  const { adminId } = req.body;
  
  // Verify admin
  db.get("SELECT * FROM users WHERE id = ? AND userType = 'admin'", [adminId], (err, admin) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
    }
    
    // Get the request
    db.get("SELECT * FROM ngo_requests WHERE id = ?", [requestId], (err, request) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
      
      // Update request status
      db.run("UPDATE ngo_requests SET status = 'approved' WHERE id = ?", [requestId], function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ message: 'Failed to approve request' });
        }
        
        // Update user type
        db.run("UPDATE users SET userType = 'ngo' WHERE id = ?", [request.userId], function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ message: 'Failed to update user type' });
          }
          
          res.json({ message: 'NGO request approved successfully' });
        });
      });
    });
  });
});

// Reject NGO request (admin only)
app.put('/ngo-request/reject/:requestId', (req, res) => {
  const requestId = req.params.requestId;
  const { adminId } = req.body;
  
  // Verify admin
  db.get("SELECT * FROM users WHERE id = ? AND userType = 'admin'", [adminId], (err, admin) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
    }
    
    // Update request status
    db.run("UPDATE ngo_requests SET status = 'rejected' WHERE id = ?", [requestId], function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: 'Failed to reject request' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }
      
      res.json({ message: 'NGO request rejected successfully' });
    });
  });
});

// Get all users (admin only)
app.get('/users', (req, res) => {
  // In a real app, you would verify the admin status here
  
  db.all("SELECT id, username, name, email, userType, createdAt FROM users", [], (err, users) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(users);
  });
});

// Donation routes
// Get all pending donations
app.get('/donations/pending', (req, res) => {
  db.all("SELECT * FROM donations WHERE status = 'pending' ORDER BY createdAt DESC", [], (err, donations) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(donations);
  });
});

// Get donations accepted by a specific NGO
app.get('/donations/accepted/:ngoId', (req, res) => {
  const ngoId = req.params.ngoId;
  
  db.all("SELECT * FROM donations WHERE status = 'accepted' AND acceptedBy = ? ORDER BY acceptedAt DESC", [ngoId], (err, donations) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(donations);
  });
});

// Accept a donation
app.put('/donations/accept/:donationId', (req, res) => {
  const donationId = req.params.donationId;
  const { ngoId } = req.body;
  
  // Verify NGO user
  db.get("SELECT * FROM users WHERE id = ? AND userType = 'ngo'", [ngoId], (err, ngo) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!ngo) {
      return res.status(403).json({ message: 'Unauthorized: NGO privileges required' });
    }
    
    // Get the donation
    db.get("SELECT * FROM donations WHERE id = ? AND status = 'pending'", [donationId], (err, donation) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found or already accepted' });
      }
      
      // Update donation status
      db.run(
        "UPDATE donations SET status = 'accepted', acceptedBy = ?, acceptedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [ngoId, donationId],
        function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ message: 'Failed to accept donation' });
          }
          
          // Award points to the donor (if userId is available in the donation)
          if (donation.userId) {
            // Get current user points
            db.get("SELECT * FROM users WHERE id = ?", [donation.userId], (err, user) => {
              if (!err && user) {
                // Calculate points based on food items
                const foodItems = donation.foodItem.split(',').length;
                const pointsToAdd = 5 + (foodItems * 2); // Base 5 points + 2 per item
                
                // Update user points
                db.run(
                  "UPDATE users SET points = points + ? WHERE id = ?",
                  [pointsToAdd, donation.userId],
                  (err) => {
                    if (err) {
                      console.error('Error updating user points:', err);
                    }
                  }
                );
              }
            });
          }
          
          res.json({ message: 'Donation accepted successfully' });
        }
      );
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
  res.json({ error: 'Something went wrong' });
});

module.exports = app;
