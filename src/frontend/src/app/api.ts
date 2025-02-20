// src/api.js
import { Recipe } from "@/lib/types/recipe";

// Fetch recipes from our own fastAPI api

export const fetchRecipes = async (): Promise<Recipe[]> => {
  console.log("Fetching Recipes");
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/get_recipes/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const data: Recipe[] = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return an empty array or handle the error appropriately
  }
};
