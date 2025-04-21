// Create a new file utils/helpers.js

// Health Score calculation
// In utils/helpers.js - update health score calculation
export function calculateHealthScore(recipe) {
    let score = 100;
    
    // More nuanced health scoring
    const unhealthyItems = [
      { term: 'sugar', penalty: 15 },
      { term: 'jaggery', penalty: 5 },
      { term: 'oil', penalty: 8 },
      { term: 'butter', penalty: 12 },
      { term: 'ghee', penalty: 10 },
      { term: 'maida', penalty: 15 },
      { term: 'white flour', penalty: 15 },
      { term: 'cream', penalty: 10 },
      { term: 'mayonnaise', penalty: 12 },
      { term: 'margarine', penalty: 15 }
    ];
    
    // Healthy items give bonuses
    const healthyItems = [
      { term: 'vegetable', bonus: 5 },
      { term: 'fruit', bonus: 5 },
      { term: 'lentil', bonus: 8 },
      { term: 'bean', bonus: 8 },
      { term: 'nut', bonus: 5 },
      { term: 'seed', bonus: 5 },
      { term: 'quinoa', bonus: 8 },
      { term: 'brown rice', bonus: 5 },
      { term: 'oat', bonus: 5 },
      { term: 'olive oil', bonus: 3 } // Olive oil is healthier than generic oil
    ];
    
    const ingredientsLower = recipe.Ingredients.toLowerCase();
    
    // Apply penalties for unhealthy items
    unhealthyItems.forEach(item => {
      if (ingredientsLower.includes(item.term)) {
        score -= item.penalty;
      }
    });
    
    // Apply bonuses for healthy items
    healthyItems.forEach(item => {
      if (ingredientsLower.includes(item.term)) {
        score += item.bonus;
      }
    });
    
    // Cooking method affects health score
    if (recipe.Instructions) {
      const instructionsLower = recipe.Instructions.toLowerCase();
      if (instructionsLower.includes('deep fry') || instructionsLower.includes('deep-fry')) {
        score -= 15;
      } 
      if (instructionsLower.includes('grill') || instructionsLower.includes('bake') || 
          instructionsLower.includes('steam') || instructionsLower.includes('boil')) {
        score += 5;
      }
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
  
  // Check if recipe is beginner friendly
  export function isBeginner(recipe) {
    const ingredientCount = recipe.Ingredients.split(',').length;
    return ingredientCount < 6 || (recipe.CookTimeInMins && recipe.CookTimeInMins < 20);
  }
  
  // Get dietary tag
  export function getDietTag(recipe) {
    const ing = recipe.Ingredients.toLowerCase();
    
    if (!ing.includes('egg') && !ing.includes('meat') && 
        !ing.includes('chicken') && !ing.includes('fish')) {
      if (!ing.includes('milk') && !ing.includes('paneer') && 
          !ing.includes('ghee') && !ing.includes('curd') && 
          !ing.includes('butter') && !ing.includes('cheese')) {
        return 'Vegan';
      }
      return 'Vegetarian';
    }
    
    if (!ing.includes('wheat') && !ing.includes('rice') && 
        !ing.includes('pasta') && !ing.includes('bread')) {
      return 'Low-Carb';
    }
    
    return 'Non-Vegetarian';
  }
  
  // Calculate waste reduction score
  // In utils/helpers.js - update this function
export function calculateWasteReduction(userIngredients, recipeIngredients) {
    if (!userIngredients || !userIngredients.length) return 0;
    
    const userItems = userIngredients.map(i => i.toLowerCase().trim());
    
    // Convert recipe ingredients string to array and normalize
    const recipeItems = recipeIngredients.toLowerCase()
      .split(',')
      .map(i => {
        // Extract just the main ingredient name (before any quantities)
        const cleanedItem = i.trim().split(' ').slice(1).join(' ');
        return cleanedItem;
      });
    
    // Count how many user ingredients are used in the recipe
    let matchCount = 0;
    userItems.forEach(userItem => {
      if (recipeItems.some(item => item.includes(userItem))) {
        matchCount++;
      }
    });
    
    // Calculate percentage of user's ingredients used in this recipe
    const score = Math.floor((matchCount / userItems.length) * 100);
    
    // Cap score at 100%
    return Math.min(score, 100);
  }