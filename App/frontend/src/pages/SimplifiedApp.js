import React, { useState, useEffect, useRef } from 'react';
import { fetchRecipes } from '../utils/api';
import Home from '../components/Home';
import DonationForm from '../components/DonationForm';
import '../styles/SimplifiedApp.css';

function SimplifiedApp() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIngredients, setUserIngredients] = useState([]);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchSectionRef = useRef(null);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = window.innerHeight * 0.5; // 50% of viewport height
      
      if (scrollTop > scrollThreshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to recipe search when prompt is clicked
  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  return (
    <div className="simplified-app">
      {/* Hero Section */}
      <div className="app-hero">
        <div className="app-hero-content">
          <h1>SustainEat</h1>
          <p className="hero-quote">"Food waste isn't waste until we waste it."</p>
          <div className="scroll-prompt" onClick={scrollToSearch}>
            <p>Swipe down to find recipes</p>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      {/* Recipe Search Section */}
      <div ref={searchSectionRef} className={`search-section ${scrolled ? 'visible' : ''}`}>
        <header className="app-header">
          <h1>SustainEat Recipe Finder</h1>
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
            
            {/* Donation section */}
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
    </div>
  );
}

export default SimplifiedApp;