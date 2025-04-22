import React, { useState, useEffect, useRef } from 'react';
import { fetchRecipes } from '../utils/api';
import Home from '../components/Home';
import DonationForm from '../components/DonationForm';
import '../styles/SimplifiedApp.css';
import Footer from '../components/Footer';

function SimplifiedApp() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIngredients, setUserIngredients] = useState([]);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ingredientTags, setIngredientTags] = useState([]);
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

  const addIngredientTag = () => {
    if (!ingredientInput.trim()) return;
    
    const newTag = ingredientInput.trim();
    if (!ingredientTags.includes(newTag)) {
      setIngredientTags([...ingredientTags, newTag]);
    }
    setIngredientInput('');
  };

  const removeIngredientTag = (tag) => {
    setIngredientTags(ingredientTags.filter(t => t !== tag));
  };

  const searchRecipes = async () => {
    if (!ingredientTags.length) return;
    
    setLoading(true);
    setUserIngredients(ingredientTags); // Store user ingredients for reuse suggestions
    
    const result = await fetchRecipes(ingredientTags.join(','));
    setRecipes(result);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredientTag();
    }
  };

  return (
    <div className="simplified-app">
      {/* Hero Section */}
      <div className="app-hero">
        <div className="app-hero-content">
          <h1>UyirUnavu</h1>
          <p className="hero-quote-tamil">"பாத்தூண் மரீஇ யவனைப் பசியென்னுந்தீப்பிணி தீண்ட லறிது"</p>
          <p className="hero-quote">"Even as one who has taken food becomes faint from disease, so does the hungry man grow faint from the fierce fire of starvation."</p>
          <div className="scroll-prompt" onClick={scrollToSearch}>
            <p>Scroll down to find recipes</p>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      {/* Recipe Search Section */}
      <div ref={searchSectionRef} className={`search-section ${scrolled ? 'visible' : ''}`}>
        <header className="app-header">
          <h1>Lets Start Cooking !</h1>
          <p>Find recipes using what you already have</p>
        </header>
        
        <div className="search-container">
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Type an ingredient and press Enter..."
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={addIngredientTag} className="add-tag-btn">+</button>
          </div>
          
          {ingredientTags.length > 0 && (
            <div className="ingredient-tags">
              {ingredientTags.map((tag, index) => (
                <div key={index} className="ingredient-tag">
                  {tag}
                  <span onClick={() => removeIngredientTag(tag)} className="remove-tag">×</span>
                </div>
              ))}
            </div>
          )}
          
          <button 
            onClick={searchRecipes} 
            className="search-btn"
            disabled={ingredientTags.length === 0}
          >
            Find Recipes
          </button>
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
      
      {/* Footer Section */}
      <Footer />
      </div>
  );
}

export default SimplifiedApp;