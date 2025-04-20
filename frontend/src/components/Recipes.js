import React from 'react';

function Recipe({ recipe }) {
  return (
    <div className="recipe-card">
      <h3>{recipe.RecipeName || "Unnamed Recipe"}</h3>
      <p><strong>Ingredients:</strong> {recipe.Ingredients}</p>
      <p><strong>Cooking Time:</strong> {recipe.CookTimeInMins || "Unknown"} minutes</p>
      <p><strong>Instructions:</strong> {recipe.Instructions || "No instructions provided."}</p>
    </div>
  );
}

export default Recipe;