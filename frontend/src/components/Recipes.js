import React, { useState } from 'react';
import { calculateHealthScore, isBeginner, getDietTag, calculateWasteReduction } from '../utils/helpers';
import '../styles/Recipes.css'; // We'll create this file next

function Recipe({ recipe, userIngredients }) {
  const [flipped, setFlipped] = useState(false);
  
  // Calculate scores and tags
  const healthScore = calculateHealthScore(recipe);
  const dietTag = getDietTag(recipe);
  const wasteScore = userIngredients && userIngredients.length > 0 
    ? calculateWasteReduction(userIngredients, recipe.Ingredients) 
    : null;
  
  // Split ingredients into an array for display
  const ingredientsList = recipe.Ingredients.split(',')
    .map(i => i.trim())
    .filter(i => i);
  
  // Function to handle flip toggle
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div 
      className={`recipe-card-container ${flipped ? 'flipped' : ''}`} 
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className="recipe-card-inner">
        {/* Front of card */}
        <div className="recipe-card-front">
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
          
          <div className="view-details">
            <span>Hover to view details</span>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="recipe-card-back">
          <h3>{recipe.RecipeName}</h3>
          
          <div className="back-content">
            <div className="ingredients-section">
              <h4>Ingredients:</h4>
              <ul className="ingredients-list">
                {ingredientsList.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            {recipe.Instructions && (
              <div className="instructions-section">
                <h4>Instructions:</h4>
                <p>{recipe.Instructions}</p>
              </div>
            )}
            
            {wasteScore !== null && (
              <div className="waste-score">
                <p><strong>Waste Reduction:</strong> {wasteScore}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;