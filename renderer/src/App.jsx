import './App.css'
import { useState } from 'react';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddRecipe = (e) => {
    e.preventDefault();
    if (!recipeName.trim())
      return;

    const newRecipe = {
      name: recipeName.trim(),
      ingredients: [],
    };

    setRecipes((prev) => [...prev, newRecipe]);
    setRecipeName('');
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.trim() || selectedRecipeIndex === null)
      return;

    const updatedRecipes = [...recipes];
    updatedRecipes[selectedRecipeIndex].ingredients.push(newIngredient.trim());

    setRecipes(updatedRecipes);
    setNewIngredient('');
  };

  const handleSendEmail = async () => {
    const result = await window.electron.sendTestEmail();
    if (result.success) {
      alert(`Email sent.`);
    } else {
      alert(`Email failed to send: ${result.error}`);
    }
  };

  const selectedRecipe = selectedRecipeIndex !== null ? recipes[selectedRecipeIndex] : null;

  return (
    <>
      <div>
        <h1>Recipe Manager</h1>
        <form onSubmit={handleAddRecipe}>
          <input
            type='text'
            placeholder='New Recipe Name'
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            />
            <button type='submit'>Add Recipe</button>
        </form>
        <h2>Recipes</h2>
        {recipes.length === 0 ? (
          <p>No recipes yet</p>
        ) : (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <button onClick={() => setSelectedRecipeIndex(index)}>{recipe.name}</button>
              </li>
            ))}
          </ul>
        )}
        {selectedRecipe ? (
          <>
            <h2>Editing?</h2>
            <form onSubmit={handleAddIngredient}>
              <input
                type='text'
                placeholder='New Ingredient'
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                />
                <button type='submit'>Add Ingredient</button>
            </form>
            <h3>Ingredients</h3>
            {selectedRecipe.ingredients.length === 0 ? (
              <p>No Ingredients Yet</p>
            ) : (
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>Please select a recipe</p>
        )}
      </div>
    </>
  )
}

export default App
