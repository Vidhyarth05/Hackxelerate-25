import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>SustainEat</h1>
        <p>Find sustainable recipes with ingredients you already have</p>
      </header>
      
      <div className="landing-features">
        <div className="feature">
          <div className="feature-icon">🍲</div>
          <h3>Find recipes with what you have</h3>
          <p>Turn your ingredients into delicious meals</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🥗</div>
          <h3>Healthy meal options</h3>
          <p>Discover nutritious recipes with health scores</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">♻️</div>
          <h3>Reduce food waste</h3>
          <p>Get suggestions for using leftover ingredients</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🤝</div>
          <h3>Share with community</h3>
          <p>Donate excess food items to those who need it</p>
        </div>
      </div>
      
      <div className="cta-buttons">
        <Link to="/login" className="cta-btn login">Login</Link>
        <Link to="/register" className="cta-btn signup">Sign Up</Link>
      </div>
      
      <div className="landing-testimonials">
        <h2>What users are saying</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"I've reduced my food waste by 50% since using this app!"</p>
            <div className="user">- Sarah K.</div>
          </div>
          
          <div className="testimonial">
            <p>"The health scores help me make better meal choices for my family."</p>
            <div className="user">- Michael T.</div>
          </div>
          
          <div className="testimonial">
            <p>"I found amazing recipes I never would have tried otherwise."</p>
            <div className="user">- Priya M.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;