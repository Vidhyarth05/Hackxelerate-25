export const fetchRecipes = async (ingredient) => {
  try {
    const response = await fetch(`http://localhost:3000/recipes?q=${ingredient}`);
    const data = await response.json();
    console.log('API Response:', data);
    
    // Get the recipes array
    const recipes = data.recipes || [];
    
    // Remove duplicates based on recipe name
    const uniqueRecipes = recipes.reduce((unique, recipe) => {
      // Check if we already have this recipe name in our unique array
      const existingRecipe = unique.find(r => r.RecipeName === recipe.RecipeName);
      
      // If it doesn't exist yet, add it to our unique recipes
      if (!existingRecipe) {
        unique.push(recipe);
      }
      
      return unique;
    }, []);
    
    return uniqueRecipes;
  } catch (error) {
    console.error('API fetch error:', error);
    return [];
  }
};