import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimplifiedApp from './pages/SimplifiedApp';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimplifiedApp />} />
        <Route path="*" element={<SimplifiedApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;