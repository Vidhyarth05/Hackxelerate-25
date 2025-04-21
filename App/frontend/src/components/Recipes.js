import React, { useState } from 'react';
import { calculateHealthScore, isBeginner, getDietTag, calculateWasteReduction } from '../utils/helpers';
import RecipeDetail from './RecipeDetail';
import '../styles/Recipes.css';

function Recipe({ recipe, userIngredients }) {
  const [showDetail, setShowDetail] = useState(false);
  
  // Calculate scores and tags
  const healthScore = calculateHealthScore(recipe);
  const dietTag = getDietTag(recipe);
  const wasteScore = userIngredients && userIngredients.length > 0 
    ? calculateWasteReduction(userIngredients, recipe.Ingredients) 
    : null;
  
  return (
    <>
      <div className="recipe-card">
        <div className="recipe-image">
          {/* Placeholder image - in a real app, you'd use the recipe's actual image */}
          <div className="placeholder-img">🍽️</div>
        </div>
        <h3>{recipe.RecipeName || "Unnamed Recipe"}</h3>
        
        {/* Tags section */}
        <div className="recipe-tags">
          {isBeginner(recipe) && <span className="tag beginner">Beginner</span>}
          <span className={`tag diet ${dietTag.toLowerCase()}`}>{dietTag}</span>
          <span className={`tag health-score score-${Math.floor(healthScore/20)}`}>
            {healthScore}/100
          </span>
        </div>
        
        <div className="cook-time">
          <span>⏱️ {recipe.CookTimeInMins || "?"} mins</span>
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
          recipe={recipe} 
          healthScore={healthScore}
          dietTag={dietTag}
          wasteScore={wasteScore}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default Recipe;