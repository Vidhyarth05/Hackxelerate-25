// utils/api.js
export const fetchRecipes = async (ingredient) => {
  try {
    // Make sure the URL matches your backend route exactly
    const response = await fetch(`http://localhost:3000/recipes?q=${ingredient}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data); // Add logging for debugging
    return data.recipes || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};
