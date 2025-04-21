import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RecipeFinder from './pages/RecipeFinder';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // This function can be called from Login component
  const updateLoginStatus = () => {
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  };
  
  useEffect(() => {
    // Check if user is logged in on initial load
    updateLoginStatus();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          <Login updateLoginStatus={updateLoginStatus} />
        } />
        <Route path="/register" element={
          <Login updateLoginStatus={updateLoginStatus} />
        } />
        <Route 
          path="/recipes" 
          element={isLoggedIn ? <RecipeFinder /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;