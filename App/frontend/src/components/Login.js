import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin, onClose }) {
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
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate input
    if (!loginForm.username || !loginForm.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      // Call the backend API for authentication
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.username);
        localStorage.setItem('userType', data.user.userType);
        localStorage.setItem('userPoints', data.user.points || '0');
        
        // Call the onLogin callback with the user data
        if (onLogin) {
          onLogin(data.user);
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate input
    if (!signupForm.fullName || !signupForm.email || !signupForm.newUsername || !signupForm.newPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (signupForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      // Call the backend API for registration
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupForm.newUsername,
          password: signupForm.newPassword,
          name: signupForm.fullName,
          email: signupForm.email,
          // All new users are normal users by default
          userType: 'normal'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Show success message and switch to login form
        alert('Registration successful! Please log in with your new account.');
        setIsSignup(false);
        setLoginForm({
          username: signupForm.newUsername,
          password: ''
        });
        setSignupForm({
          fullName: '',
          email: '',
          newUsername: '',
          newPassword: '',
        });
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="form-tabs">
          <button 
            className={!isSignup ? 'active' : ''} 
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button 
            className={isSignup ? 'active' : ''} 
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {!isSignup ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                value={loginForm.username} 
                onChange={handleLoginChange} 
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={loginForm.password} 
                onChange={handleLoginChange} 
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <p className="form-footer">
              Forgot your password? <a href="#reset">Reset it here</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={signupForm.fullName} 
                onChange={handleSignupChange} 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={signupForm.email} 
                onChange={handleSignupChange} 
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                name="newUsername" 
                value={signupForm.newUsername} 
                onChange={handleSignupChange} 
                placeholder="Choose a username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="newPassword" 
                value={signupForm.newPassword} 
                onChange={handleSignupChange} 
                placeholder="Choose a password (min 6 characters)"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <p className="form-footer">
              Already have an account? <button type="button" onClick={() => setIsSignup(false)}>Login here</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
