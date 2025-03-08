"use client";

import { useState, useCallback, useEffect } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import Box from "@/components/test-recipe";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { useAuth } from "@/context/authContext";
import Cookies from "js-cookie";

export default function FYPPage() {
  const [Recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIds, setCurrentRecipeIds] = useState<number[]>(() => {
    const cookieValue = Cookies.get("currentRecipeIds");
    return cookieValue ? JSON.parse(cookieValue) : [];
  });
  const { user } = useAuth();

  const loadMoreRecipes = useCallback(async () => {
    console.log("Loading more recipes");
    if (!user) {
      return false;
    }
    try {
      console.log("Current Recipe Ids:", currentRecipeIds);
      const newRecipes = (await fetchRecipes(user.id, currentRecipeIds)).map(
        (recipe) => ({
          id: recipe.id,
          recipeName: recipe.recipeName,
          imageURL: recipe.imageURL,
          cookingInstructions: recipe.cookingInstructions,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fats: recipe.fats,
          allergensList: recipe.allergensList,
        })
      );
      const updatedRecipeIds = [
        ...currentRecipeIds,
        ...newRecipes.map((recipe) => recipe.id),
      ];
      setCurrentRecipeIds(updatedRecipeIds);
      Cookies.set("currentRecipeIds", JSON.stringify(updatedRecipeIds));
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
  }, [currentRecipeIds]);

  useEffect(() => {
    console.log("Current Recipe Ids:", currentRecipeIds);
  }, [currentRecipeIds]);

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      console.log("Fetching initial recipes");
      if (!user) {
        return;
      }
      try {
        const initialRecipes = await fetchRecipes(user?.id, currentRecipeIds);
        setRecipes(initialRecipes);
        const initialRecipeIds = initialRecipes.map((recipe) => recipe.id);
        setCurrentRecipeIds((prevIds) => {
          const updatedIds = [...prevIds, ...initialRecipeIds];
          Cookies.set("currentRecipeIds", JSON.stringify(updatedIds));
          return updatedIds;
        });
      } catch (error) {
        console.error("Error fetching initial recipes:", error);
      }
    };

    fetchInitialRecipes();
  }, []);

  return (
    <main className="h-screen w-full bg-black">
      <RecipeCarousel onLastSlide={loadMoreRecipes}>
        {user &&
          Recipes.map((Recipe) => (
            <Box key={Recipe.id} userId={user?.id} recipe={Recipe} isProfile={false}/>
          ))}
      </RecipeCarousel>
    </main>
  );
}
