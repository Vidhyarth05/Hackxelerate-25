import React, { useState } from 'react';
import { calculateHealthScore, isBeginner, getDietTag, calculateWasteReduction } from '../utils/helpers';
import RecipeDetail from './RecipeDetail';
import '../styles/Recipes.css';

// In Recipes.js
function Recipe({ recipe, userIngredients }) {
  const [showDetail, setShowDetail] = useState(false);
  
  // Normalize recipe data to handle different property naming conventions
  const normalizedRecipe = {
    RecipeName: recipe.Name || recipe.RecipeName || "Unnamed Recipe",
    Ingredients: recipe.Ingredients || "",
    Instructions: recipe.Instructions || "",
    CookTimeInMins: recipe.CookTime || recipe.CookTimeInMins || "?",
    // Add other properties as needed
  };
  
  // Calculate scores and tags
  const healthScore = recipe.healthScore || calculateHealthScore(normalizedRecipe);
  const dietTag = getDietTag(normalizedRecipe);
  const wasteScore = userIngredients && userIngredients.length > 0 
    ? calculateWasteReduction(userIngredients, normalizedRecipe.Ingredients) 
    : null;
  
  // Check if this is a leftover recipe
  const isLeftoverRecipe = recipe.isLeftoverRecipe || false;
  
  return (
    <>
      <div className={`recipe-card ${isLeftoverRecipe ? 'leftover-recipe' : ''}`}>
        <div className="recipe-image">
          <div className="placeholder-img">🍽️</div>
        </div>
        <h3>{normalizedRecipe.RecipeName}</h3>
        
        {/* Tags section */}
        <div className="recipe-tags">
          {isBeginner(normalizedRecipe) && <span className="tag beginner">Beginner</span>}
          <span className={`tag diet ${dietTag.toLowerCase()}`}>{dietTag}</span>
          <span className={`tag health-score score-${Math.floor(healthScore/20)}`}>
            {healthScore}/100
          </span>
          {isLeftoverRecipe && <span className="tag leftover">Leftover</span>}
        </div>
        
        <div className="cook-time">
          <span>⏱️ {normalizedRecipe.CookTimeInMins} mins</span>
        </div>
        
        <div className="recipe-overlay">
          <button className="view-recipe-btn" onClick={() => setShowDetail(true)}>
            View Recipe
          </button>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {showDetail && (
        <RecipeDetail 
          recipe={normalizedRecipe} 
          healthScore={healthScore}
          dietTag={dietTag}
          wasteScore={wasteScore}
          isLeftoverRecipe={isLeftoverRecipe}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default Recipe;