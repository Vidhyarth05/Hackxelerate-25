import React from 'react';
import '../styles/RecipeDetail.css';

function RecipeDetail({ recipe, healthScore, dietTag, wasteScore, onClose }) {
  // Split ingredients into an array for display
  const ingredientsList = recipe.Ingredients.split(',')
    .map(i => i.trim())
    .filter(i => i);

  return (
    <div className="recipe-detail-overlay">
      <div className="recipe-detail-container">
        <div className="recipe-detail-header">
          <h2>{recipe.RecipeName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="recipe-detail-content">
          <div className="recipe-main-info">
            <div className="recipe-image-large">
              {/* Placeholder for recipe image */}
              <div className="placeholder-img-large">🍽️</div>
            </div>

            <div className="recipe-meta">
              <div className="recipe-tags-large">
                <span className={`tag diet ${dietTag.toLowerCase()}`}>{dietTag}</span>
                <span className={`tag health-score score-${Math.floor(healthScore/20)}`}>
                  Health Score: {healthScore}/100
                </span>
                {wasteScore !== null && (
                  <span className="tag waste-score">
                    Waste Reduction: {wasteScore}%
                  </span>
                )}
              </div>
              <p className="cook-time-large">
                <strong>Cook Time:</strong> {recipe.CookTimeInMins || "?"} minutes
              </p>
            </div>
          </div>

          <div className="recipe-sections">
            <div className="ingredients-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {ingredientsList.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            {recipe.Instructions && (
              <div className="instructions-section">
                <h3>Instructions</h3>
                <p>{recipe.Instructions}</p>
              </div>
            )}

            <div className="recipe-nutrition">
              <h3>Nutrition & Sustainability</h3>
              <p>
                This recipe has a health score of <strong>{healthScore}/100</strong> based on 
                ingredients and cooking method.
              </p>
              {wasteScore !== null && (
                <p>
                  By using this recipe, you're reducing potential food waste by approximately 
                  <strong> {wasteScore}%</strong> of your selected ingredients.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;