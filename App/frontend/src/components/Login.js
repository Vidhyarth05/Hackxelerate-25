import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    newUsername: '',
    newPassword: '',
  });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!loginForm.username || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication (in a real app, this would call an API)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', loginForm.username);
    localStorage.setItem('userPoints', '0'); // Initialize points
    
    if (onLogin) {
      onLogin(loginForm.username);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!signupForm.fullName || !signupForm.email || !signupForm.newUsername || !signupForm.newPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Mock user creation (in a real app, this would call an API)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', signupForm.newUsername);
    localStorage.setItem('userPoints', '0'); // Initialize points
    
    if (onLogin) {
      onLogin(signupForm.newUsername);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="app-logo">
          <div className="app-name">Ready To Cook ?</div>
        </div>
        
        <div className="login-tabs">
          <button 
            className={`login-tab ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button 
            className={`login-tab ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        {!isSignup ? (
          <>
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  placeholder="Enter your username"
                />
                <span className="form-icon">👤</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
                <span className="form-icon">🔒</span>
              </div>
              
              <button type="submit" className="login-btn">Let's Cook !</button>
            </form>
            
            
            
            <div className="login-footer">
              <p>Forgot your password? <a href="#">Reset it here</a></p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSignupSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={signupForm.fullName}
                onChange={handleSignupChange}
                placeholder="Enter your full name"
              />
              <span className="form-icon">👤</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="Enter your email"
              />
              <span className="form-icon">✉️</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="newUsername">Username</label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                value={signupForm.newUsername}
                onChange={handleSignupChange}
                placeholder="Choose a username"
              />
              <span className="form-icon">🆔</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={signupForm.newPassword}
                onChange={handleSignupChange}
                placeholder="Choose a password"
              />
              <span className="form-icon">🔒</span>
            </div>
            
            <button type="submit" className="signup-btn">Create Account</button>
            
            <div className="login-footer">
              <p>By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;