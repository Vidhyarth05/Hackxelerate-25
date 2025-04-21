import React, { useState } from 'react';
import Recipe from './Recipes';
import { calculateHealthScore, calculateWasteReduction } from '../utils/helpers';
import '../styles/Home.css'; // We'll create this file next

function Home({ recipes, userIngredients }) {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 recipes
  
  // Find recipes for leftover reuse
  const reuseSuggestions = selectedIngredient ? 
    recipes.filter(r => r.Ingredients.toLowerCase().includes(selectedIngredient.toLowerCase())) : [];

  // Calculate scores for all recipes and sort
  const recipesWithScores = recipes.map(recipe => {
    const healthScore = calculateHealthScore(recipe);
    const wasteScore = calculateWasteReduction(userIngredients, recipe.Ingredients);
    // Combined score favors both health and waste reduction
    const combinedScore = healthScore * 0.5 + wasteScore * 0.5;
    
    return {
      ...recipe,
      healthScore,
      wasteScore,
      combinedScore
    };
  }).sort((a, b) => b.combinedScore - a.combinedScore); // Sort by combined score (descending)

  if (!recipes || !recipes.length) {
    return <p className="no-recipes">No recipes found. Try different ingredients!</p>;
  }

  return (
    <div>
      <div className="recipes-grid">
        {recipesWithScores.slice(0, visibleCount).map((recipe, index) => (
          <Recipe 
            key={index} 
            recipe={recipe} 
            userIngredients={userIngredients}
          />
        ))}
      </div>
      
      {/* Show "See More" button if there are more recipes to display */}
      {visibleCount < recipesWithScores.length && (
        <div className="see-more-container">
          <button 
            className="see-more-btn"
            onClick={() => setVisibleCount(prev => prev + 6)}
          >
            See More Recipes
          </button>
        </div>
      )}
      
      {/* Leftover Reuse Tips Section */}
      {userIngredients && userIngredients.length > 0 && (
        <div className="leftover-section">
          <h2>Find Recipes for Leftover Ingredients</h2>
          <div className="ingredient-selector">
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
            >
              <option value="">Select an ingredient</option>
              {userIngredients.map((ing, i) => (
                <option key={i} value={ing}>{ing}</option>
              ))}
            </select>
          </div>
          
          {selectedIngredient && reuseSuggestions.length > 0 ? (
            <div className="reuse-suggestions">
              <h3>Recipes using {selectedIngredient}:</h3>
              <ul className="suggestions-list">
                {reuseSuggestions.map((recipe, i) => (
                  <li key={i}>{recipe.RecipeName}</li>
                ))}
              </ul>
            </div>
          ) : selectedIngredient && (
            <p>No recipes found for {selectedIngredient}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;