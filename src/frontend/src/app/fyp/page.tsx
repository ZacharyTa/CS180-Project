"use client";

import { useState, useCallback, useEffect } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import RecipeComponent from "@/components/recipe";
import Box from "@/components/test-recipe";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";

export default function Home() {
  const [Recipes, setRecipes] = useState<Recipe[]>([]);

  const loadMoreRecipes = useCallback(async () => {
    console.log("Loading more recipes");
    try {
      const newRecipes = (await fetchRecipes()).map((recipe) => ({
        id: recipe.id,
        recipeName: recipe.recipeName,
        imageURL: recipe.imageURL,
        cookingInstructions: recipe.cookingInstructions,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fats: recipe.fats,
        allergensList: recipe.allergensList,
      }));
      setRecipes((prevRecipes: Recipe[]) => {
        const updatedRecipes = [...prevRecipes, ...newRecipes];
        console.log("Updated Recipes length:", updatedRecipes);
        // Keep only the last 20 Recipes
        //return updatedRecipes.slice(-20) # key error here bc we manually create the recipe id
        return updatedRecipes;
      });
      return true;
    } catch (error) {
      console.error("Error loading more recipes:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      console.log("Fetching initial recipes");
      try {
        const initialRecipes = await fetchRecipes();
        setRecipes(initialRecipes);
      } catch (error) {
        console.error("Error fetching initial recipes:", error);
      }
    };

    fetchInitialRecipes();
  }, []);

  return (
    <main className="h-screen w-full bg-black">
      <RecipeCarousel onLastSlide={loadMoreRecipes}>
        {Recipes.map((Recipe) => (
          // <RecipeComponent key={Recipe.id} src={Recipe.src} />
          <Box
            key={Recipe.id}
            title={Recipe.recipeName}
            imgUrl={Recipe.imageURL}
            cookingInstructions={Recipe.cookingInstructions}
            calories={Recipe.calories}
            protein={Recipe.protein}
            carbs={Recipe.carbs}
            fats={Recipe.fats}
          />
        ))}
      </RecipeCarousel>
    </main>
  );
}
