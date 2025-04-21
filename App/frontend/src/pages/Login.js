import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';

function Login({ updateLoginStatus }) {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const loginFormRef = useRef(null);
  const navigate = useNavigate();

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

  // Scroll to login form when prompt is clicked
  const scrollToLogin = () => {
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && !formData.name) {
      setError('Please enter your name to register');
      return;
    }
    
    // For this demo, we'll just simulate login/registration
    try {
      // Set login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', isLogin ? 'User' : formData.name);
      
      // Update the login status in the parent component
      if (updateLoginStatus) {
        updateLoginStatus();
      }
      
      // Redirect to recipes page after a short delay to allow state updates
      setTimeout(() => {
        navigate('/recipes', { replace: true });
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-page">
      {/* Hero Section */}
      <div className="login-hero">
        <div className="login-hero-content">
          <h1>SustainEat</h1>
          <p className="hero-quote">"Food waste isn't waste until we waste it."</p>
          <div className="scroll-prompt" onClick={scrollToLogin}>
            <p>Scroll down to login</p>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div ref={loginFormRef} className={`login-container ${scrolled ? 'visible' : ''}`}>
        <div className="login-form-box">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
          
          <div className="toggle-form">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;