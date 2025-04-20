import React from 'react';
import Recipe from './Recipes';

function Home({ recipes }) {
  if (!recipes.length) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="recipes-container">
      {recipes.map((recipe, index) => (
        <Recipe key={index} recipe={recipe} />
      ))}
    </div>
  );
}

export default Home;
