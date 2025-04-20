export const fetchRecipes = async (ingredient) => {
    try {
      const response = await fetch(`http://localhost:3000/recipes?q=${ingredient}`);
      const data = await response.json();
      console.log('API Response:', data); // Add this for debugging
      return data.recipes || []; // Change this line to return the recipes array
    } catch (error) {
      console.error('API fetch error:', error);
      return [];
    }
  };