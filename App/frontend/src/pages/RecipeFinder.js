import React, { useState } from 'react';
import { fetchRecipes } from '../utils/api';
import Home from '../components/Home';
import DonationForm from '../components/DonationForm';
import '../styles/RecipeFinder.css';

function RecipeFinder() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIngredients, setUserIngredients] = useState([]);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';

  const searchRecipes = async () => {
    if (!ingredientInput) return;
    
    setLoading(true);
    
    // Split by commas and clean up
    const ingredients = ingredientInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);
    
    setUserIngredients(ingredients); // Store user ingredients for reuse suggestions
    
    const result = await fetchRecipes(ingredients);
    setRecipes(result);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  return (
    <div className="recipe-finder">
      <header className="app-header">
        <h1>SustainEat Recipe Finder</h1>
        <div className="user-section">
          <span>Welcome, {userName}!</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)..."
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
        />
        <button onClick={searchRecipes} className="search-btn">Find Recipes</button>
      </div>
      
      {loading ? (
        <div className="loading">
          <p>Searching for recipes...</p>
        </div>
      ) : (
        <>
          <Home recipes={recipes} userIngredients={userIngredients} />
          
          {/* Donation section moved to bottom */}
          <div className="donation-section">
            <h2>Food Donation Board</h2>
            <p>Help reduce food waste by sharing excess ingredients with your community</p>
            <button 
              className="toggle-donation-btn"
              onClick={() => setShowDonationForm(!showDonationForm)}
            >
              {showDonationForm ? 'Hide Form' : 'Donate Food'}
            </button>
            
            {showDonationForm && <DonationForm />}
          </div>
        </>
      )}
    </div>
  );
}

export default RecipeFinder;