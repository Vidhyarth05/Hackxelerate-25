import React, { useState, useEffect, useRef } from 'react';
import { fetchRecipes } from '../utils/api';
import Home from '../components/Home';
import DonationForm from '../components/DonationForm';
import Login from '../components/Login';
import Profile from '../components/Profile';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const searchSectionRef = useRef(null);
  const loginSectionRef = useRef(null);

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('userName') || 'User');
      
      // Check user type and redirect if needed
      const userType = localStorage.getItem('userType');
      if (userType === 'admin') {
        window.location.href = '/admin';
      } else if (userType === 'ngo') {
        window.location.href = '/ngo';
      }
    }
  }, []);
  


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

  // Scroll to login section
  const scrollToLogin = () => {
    if (loginSectionRef.current) {
      loginSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to recipe search when prompt is clicked
  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    
    // Check if user is a string or an object and extract username accordingly
    if (typeof user === 'object' && user !== null) {
      setUserName(user.username || 'User');
      
      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.username || 'User');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userType', user.userType || 'normal');
      
      // Redirect based on user type
      if (user.userType === 'admin') {
        window.location.href = '/admin';
        return;
      } else if (user.userType === 'ngo'){
        window.location.href = '/ngo';
        return;
      }
    } else {
      // Handle case where user is already a string
      setUserName(user || 'User');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user || 'User');
    }
    
    // Auto-scroll to the search section after login (only for normal users)
    setTimeout(() => {
      scrollToSearch();
    }, 300);
  };
  
  
  const handleLogout = () => {
    // Clear localStorage items
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('donationHistory'); // Directly clear donation history
    
    // Reset all state
    setIsLoggedIn(false);
    setUserName('');
    setRecipes([]); // Clear search results
    setIngredientTags([]); // Clear ingredient tags
    setUserIngredients([]); // Clear user ingredients
    setIngredientInput(''); // Clear input field
    setShowDonationForm(false); // Hide donation form
    
    // Also trigger the donation history clear function if it exists
    if (window.clearDonationHistory) {
      window.clearDonationHistory();
    }
    
    // Scroll back to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    setUserIngredients(ingredientTags);
    
    try {
      console.log('Searching for ingredients:', ingredientTags.join(','));
      const result = await fetchRecipes(ingredientTags.join(','));
      console.log('Search results:', result);
      setRecipes(result);
    } catch (error) {
      console.error('Error in recipe search:', error);
      // Optionally set an error state here
    } finally {
      setLoading(false);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredientTag();
    }
  };

  return (
    <div className="simplified-app">
      {/* Navigation Header */}
      <div className="app-navigation">
        <div className="app-logo">UyirUnavu</div>
        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <button className="profile-btn" onClick={() => setShowProfile(true)}>
                <span className="profile-icon">{String(userName || '').charAt(0).toUpperCase()}</span>
                <span className="profile-name">{userName}</span>
              </button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="login-nav-btn" onClick={scrollToLogin}>Login</button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="app-hero">
        <div className="app-hero-content">
          <h1>UyirUnavu</h1>
          <p className="hero-quote-tamil">"பாத்தூண் மரீஇ யவனைப் பசியென்னுந்தீப்பிணி தீண்ட லறிது"</p>
          <p className="hero-quote">"Even as one who has taken food becomes faint from disease, so does the hungry man grow faint from the fierce fire of starvation."</p>
          <div className="scroll-prompt" onClick={isLoggedIn ? scrollToSearch : scrollToLogin}>
            <p>{isLoggedIn ? "Scroll down to find recipes" : "Login to start cooking"}</p>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      {!isLoggedIn && (
        <div ref={loginSectionRef} className="login-section">
          <Login onLogin={handleLogin} />
        </div>
      )}

      {/* Recipe Search Section - Only visible when logged in */}
      {isLoggedIn && (
        <div ref={searchSectionRef} className={`search-section ${scrolled ? 'visible' : ''}`}>
          <header className="app-header">
            <h1>Let's Start Cooking!</h1>
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
                
                {showDonationForm && <DonationForm updatePoints={true} />}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Profile Modal */}
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default SimplifiedApp;