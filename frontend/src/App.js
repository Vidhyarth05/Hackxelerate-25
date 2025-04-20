import React, { useState } from 'react';
import { fetchRecipes } from './utils/api';
import Home from './components/Home';
import './App.css';

function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!ingredient) return;
    setLoading(true);
    
    try {
      const result = await fetchRecipes(ingredient);
      // result is already the recipes array due to our change in api.js
      setRecipes(result);
    } catch (err) {
      console.error('Error:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Recipe Finder</h1>
      <input
        type="text"
        placeholder="Enter an ingredient..."
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
      />
      <button onClick={searchRecipes}>Search</button>
      {loading ? <p>Loading...</p> : <Home recipes={recipes} />}
    </div>
  );
}

export default App;