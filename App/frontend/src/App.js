import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimplifiedApp from './pages/SimplifiedApp';
import AdminDashboard from './components/AdminDashboard';
import NGODashboard from './components/NGODashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimplifiedApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ngo" element={<NGODashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
