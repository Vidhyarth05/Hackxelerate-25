import React, { useState, useEffect } from 'react';
import Recipe from './Recipes';
import { fetchRecipes } from '../utils/api';
import { calculateHealthScore, calculateWasteReduction, isBeginner } from '../utils/helpers';
import '../styles/Home.css';

function Home({ recipes, userIngredients }) {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 recipes
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const [loadingLeftovers, setLoadingLeftovers] = useState(false);
  
  // Remove duplicates from recipes array based on RecipeName
  const uniqueRecipes = recipes.reduce((unique, recipe) => {
    // Check if we already have this recipe name in our unique array
    const existingRecipe = unique.find(
      r => r.RecipeName === recipe.RecipeName
    );
    
    // If it doesn't exist yet, add it to our unique recipes
    if (!existingRecipe) {
      unique.push(recipe);
    }
    
    return unique;
  }, []);
  
  // Calculate scores for all unique recipes and sort
  const recipesWithScores = uniqueRecipes.map(recipe => {
    const healthScore = calculateHealthScore(recipe);
    const wasteScore = userIngredients && userIngredients.length > 0 
      ? calculateWasteReduction(userIngredients, recipe.Ingredients) 
      : null;
    // Combined score favors both health and waste reduction
    const combinedScore = healthScore * 0.5 + wasteScore * 0.5;
    
    return {
      ...recipe,
      healthScore,
      wasteScore,
      combinedScore
    };
  }).sort((a, b) => b.combinedScore - a.combinedScore); // Sort by combined score (descending)

  // Fetch quick recipes for the selected leftover ingredient
  useEffect(() => {
    const fetchQuickSuggestions = async () => {
      if (!selectedIngredient) {
        setQuickSuggestions([]);
        return;
      }
      
      setLoadingLeftovers(true);
      try {
        const result = await fetchRecipes(selectedIngredient);
        
        // Remove duplicates from API response
        const uniqueResults = result.reduce((unique, recipe) => {
          const existingRecipe = unique.find(r => r.RecipeName === recipe.RecipeName);
          if (!existingRecipe) {
            unique.push(recipe);
          }
          return unique;
        }, []);
        
        // Filter for only beginner-friendly, quick recipes
        const easyRecipes = uniqueResults.filter(recipe => {
          return isBeginner(recipe) && 
                 (recipe.CookTimeInMins <= 20 || !recipe.CookTimeInMins) && 
                 recipe.Ingredients.split(',').length < 7;
        });
        
        // Take just the top 5 easy recipes
        const topSuggestions = easyRecipes.slice(0, 5);
        
        setQuickSuggestions(topSuggestions);
      } catch (error) {
        console.error('Error fetching leftover recipes:', error);
      } finally {
        setLoadingLeftovers(false);
      }
    };
    
    fetchQuickSuggestions();
  }, [selectedIngredient]);

  if (!uniqueRecipes || !uniqueRecipes.length) {
    return <p className="no-recipes">No recipes found. Try different ingredients!</p>;
  }

  return (
    <div>
      <div className="recipes-container">
        {recipesWithScores.slice(0, visibleCount).map((recipe, index) => (
          <Recipe 
            key={`main-${index}`} 
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
      
      {/* Quick Leftover Ideas Section */}
      {userIngredients && userIngredients.length > 0 && (
        <div className="leftover-section">
          <h2>Quick Ideas for Leftover Ingredients</h2>
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
          
          {loadingLeftovers && (
            <div className="loading-leftovers">
              <p>Finding quick ideas for {selectedIngredient}...</p>
            </div>
          )}
          
          {selectedIngredient && !loadingLeftovers && quickSuggestions.length > 0 ? (
            <div className="quick-suggestions">
              <h3>Quick and easy ideas using {selectedIngredient}:</h3>
              <ul className="quick-recipe-list">
                {quickSuggestions.map((recipe, index) => (
                  <li key={index} className="quick-recipe-item">
                    <div className="quick-recipe-name">{recipe.RecipeName}</div>
                    <div className="quick-recipe-info">
                      {recipe.CookTimeInMins ? `${recipe.CookTimeInMins} mins • ` : ''}
                      {recipe.Ingredients.split(',').length} ingredients
                    </div>
                    <div className="quick-recipe-ingredients">
                      Main ingredients: {recipe.Ingredients.split(',').slice(0, 3).join(', ')}
                      {recipe.Ingredients.split(',').length > 3 ? '...' : ''}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedIngredient && !loadingLeftovers ? (
            <p>No quick recipe ideas found for {selectedIngredient}. Try another ingredient!</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Home;