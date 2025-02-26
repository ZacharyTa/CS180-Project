"use client";

import { useState, useCallback, useEffect } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import Box from "@/components/test-recipe";
import TabBar from "@/components/tab-bar";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { useAuth } from "@/context/authContext";

export default function FYPPage() {
  const [Recipes, setRecipes] = useState<Recipe[]>([]);
  const { user } = useAuth();

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
      <TabBar />
      <RecipeCarousel onLastSlide={loadMoreRecipes}>
        {user &&
          Recipes.map((Recipe) => (
            <Box
              key={Recipe.id}
              id={Recipe.id}
              title={Recipe.recipeName}
              imgUrl={Recipe.imageURL}
              cookingInstructions={Recipe.cookingInstructions}
              calories={Recipe.calories}
              protein={Recipe.protein}
              carbs={Recipe.carbs}
              fats={Recipe.fats}
              userId={user?.id}
            />
          ))}
      </RecipeCarousel>
    </main>
  );
}
