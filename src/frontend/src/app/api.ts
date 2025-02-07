// src/api.js
export const fetchRecipes = async () => {
  console.log("Fetching Recipes");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Failed to fetching recipes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return an empty array or handle the error appropriately
  }
};
