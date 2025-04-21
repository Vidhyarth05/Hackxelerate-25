// Create a new file utils/helpers.js

// Health Score calculation
export function calculateHealthScore(recipe) {
  // Base score starts at 70 (neutral)
  let score = 70;
  
  // More nuanced health scoring
  const unhealthyItems = [
    { term: 'sugar', penalty: 12 },
    { term: 'jaggery', penalty: 5 },
    { term: 'oil', penalty: 8 },
    { term: 'butter', penalty: 10 },
    { term: 'ghee', penalty: 8 },
    { term: 'maida', penalty: 12 },
    { term: 'white flour', penalty: 12 },
    { term: 'cream', penalty: 10 },
    { term: 'mayonnaise', penalty: 10 },
    { term: 'margarine', penalty: 12 },
    { term: 'processed', penalty: 15 },
    { term: 'syrup', penalty: 10 },
    { term: 'bacon', penalty: 10 },
    { term: 'sausage', penalty: 10 }
  ];
  
  // Healthy items give bonuses
  const healthyItems = [
    { term: 'vegetable', bonus: 5 },
    { term: 'fruit', bonus: 5 },
    { term: 'lentil', bonus: 8 },
    { term: 'bean', bonus: 7 },
    { term: 'nut', bonus: 5 },
    { term: 'seed', bonus: 5 },
    { term: 'quinoa', bonus: 8 },
    { term: 'brown rice', bonus: 5 },
    { term: 'oat', bonus: 5 },
    { term: 'olive oil', bonus: 3 },
    { term: 'avocado', bonus: 5 },
    { term: 'herb', bonus: 3 },
    { term: 'spice', bonus: 2 },
    { term: 'greens', bonus: 6 },
    { term: 'leafy', bonus: 6 }
  ];
  
  const ingredientsLower = recipe.Ingredients ? recipe.Ingredients.toLowerCase() : '';
  
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
    } else if (instructionsLower.includes('fry') || instructionsLower.includes('fried')) {
      score -= 8;
    }
    
    if (instructionsLower.includes('grill')) {
      score += 5;
    }
    if (instructionsLower.includes('bake')) {
      score += 4;
    }
    if (instructionsLower.includes('steam')) {
      score += 6;
    }
    if (instructionsLower.includes('boil')) {
      score += 3;
    }
    if (instructionsLower.includes('raw')) {
      score += 7;
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

// Check if recipe is beginner friendly
export function isBeginner(recipe) {
  if (!recipe) return false;
  
  // Count actual ingredients (not counting spices separately)
  const ingredientText = recipe.Ingredients || '';
  const ingredientCount = ingredientText.split(',').length;
  
  // Check cook time
  const cookTime = recipe.CookTimeInMins || 0;
  
  // Check for complex techniques in instructions
  const hasComplexTechniques = recipe.Instructions && (
      recipe.Instructions.toLowerCase().includes('knead') ||
      recipe.Instructions.toLowerCase().includes('proof') ||
      recipe.Instructions.toLowerCase().includes('marinate overnight') ||
      recipe.Instructions.toLowerCase().includes('sous vide') ||
      recipe.Instructions.toLowerCase().includes('temper chocolate')
  );
  
  return (ingredientCount < 7 || cookTime < 25) && !hasComplexTechniques;
}

// Get dietary tag
export function getDietTag(recipe) {
  if (!recipe || !recipe.Ingredients) return 'Unknown';
  
  const ing = recipe.Ingredients.toLowerCase();
  const tags = [];
  
  // Basic diet categories
  if (!ing.includes('egg') && 
      !ing.includes('meat') && 
      !ing.includes('chicken') && 
      !ing.includes('fish') && 
      !ing.includes('beef') && 
      !ing.includes('pork') && 
      !ing.includes('mutton') && 
      !ing.includes('seafood') && 
      !ing.includes('prawn') && 
      !ing.includes('shrimp')) {
      
      if (!ing.includes('milk') && 
          !ing.includes('paneer') && 
          !ing.includes('ghee') && 
          !ing.includes('curd') && 
          !ing.includes('yogurt') &&
          !ing.includes('butter') && 
          !ing.includes('cheese') && 
          !ing.includes('cream')) {
          tags.push('Vegan');
      } else {
          tags.push('Vegetarian');
      }
  } else {
      tags.push('Non-Vegetarian');
  }
  
  // Additional diet properties
  if (!ing.includes('wheat') && 
      !ing.includes('flour') && 
      !ing.includes('bread') && 
      !ing.includes('pasta') && 
      !ing.includes('maida')) {
      tags.push('Gluten-Free');
  }
  
  if (!ing.includes('wheat') && 
      !ing.includes('rice') && 
      !ing.includes('pasta') && 
      !ing.includes('bread') && 
      !ing.includes('potato') && 
      !ing.includes('sugar')) {
      tags.push('Low-Carb');
  }
  
  if (ing.includes('protein') || 
      ing.includes('chicken breast') || 
      ing.includes('greek yogurt') || 
      ing.includes('egg white') || 
      ing.includes('quinoa')) {
      tags.push('High-Protein');
  }
  
  return tags.join(', ');
}

// Calculate waste reduction score
export function calculateWasteReduction(userIngredients, recipeIngredients) {
  if (!userIngredients || !userIngredients.length || !recipeIngredients) return 0;
  
  // Normalize user ingredients
  const userItems = userIngredients.map(i => i.toLowerCase().trim());
  
  // Convert recipe ingredients string to array and normalize
  const recipeItems = recipeIngredients.toLowerCase()
      .split(',')
      .map(i => i.trim());
  
  // Extract main ingredients (remove quantities and units)
  const mainRecipeIngredients = recipeItems.map(item => {
      // Remove common quantity patterns
      return item
          .replace(/^\d+\s*/, '') // Remove leading numbers
          .replace(/^[a-z]+\s+of\s+/, '') // Remove "cup of", "tablespoon of", etc.
          .replace(/^(a|an|one)\s+/, '') // Remove "a", "an", "one"
          .replace(/^(few|some)\s+/, '') // Remove "few", "some"
          .trim();
  });
  
  // Count how many user ingredients are used in the recipe
  let matchCount = 0;
  let totalMatchScore = 0;
  
  userItems.forEach(userItem => {
      // Check if any recipe ingredient contains this user item
      const isMatched = mainRecipeIngredients.some(recipeItem => {
          // Check for full matches or if the recipe item contains the user item
          return recipeItem === userItem || 
                 recipeItem.includes(userItem) || 
                 userItem.includes(recipeItem);
      });
      
      if (isMatched) {
          matchCount++;
          // Ingredients that would likely go bad sooner get higher weight
          if (userItem.includes('spinach') || 
              userItem.includes('lettuce') || 
              userItem.includes('tomato') || 
              userItem.includes('cucumber') ||
              userItem.includes('mushroom') ||
              userItem.includes('berry') ||
              userItem.includes('avocado')) {
              totalMatchScore += 1.5; // Perishable ingredients get bonus weight
          } else {
              totalMatchScore += 1;
          }
      }
  });
  
  // Base score on weighted count vs total user ingredients
  const score = Math.floor((totalMatchScore / userItems.length) * 100);
  
  // Cap score at 100%
  return Math.min(score, 100);
}