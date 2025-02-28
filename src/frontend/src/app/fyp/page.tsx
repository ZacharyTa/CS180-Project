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
        const uniqueRecipes = [...prevRecipes, ...newRecipes].reduce(
          (acc, recipe) => {
            if (!acc.some((r) => r.id === recipe.id)) {
              acc.push(recipe);
            }
            return acc;
          },
          [] as Recipe[]
        );

        console.log("Updated Recipes length:", uniqueRecipes);
        return uniqueRecipes;
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
            <Box key={Recipe.id} userId={user?.id} recipe={Recipe} />
          ))}
      </RecipeCarousel>
    </main>
  );
}
