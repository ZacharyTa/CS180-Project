"use client";

import { useState, useCallback, useEffect } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import Box from "@/components/test-recipe";
import TabBar from "@/components/tab-bar";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { useAuth } from "@/context/authContext";
import Cookies from "js-cookie";

export default function Home() {
  const [Recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIds, setCurrentRecipeIds] = useState<number[]>(() => {
    const cookieValue = Cookies.get("currentRecipeIds");
    return cookieValue ? JSON.parse(cookieValue) : [];
  });
  const { user } = useAuth();

  const loadMoreRecipes = useCallback(async () => {
    console.log("Loading more recipes");
    try {
      console.log("Current Recipe Ids:", currentRecipeIds);
      const newRecipes = (await fetchRecipes(currentRecipeIds)).map(
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
        const updatedRecipes = [...prevRecipes, ...newRecipes];
        console.log("Updated Recipes length:", updatedRecipes);
        return updatedRecipes;
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
      try {
        const initialRecipes = await fetchRecipes([]);
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
              allergensList={Recipe.allergensList}
              userId={user?.id}
            />
          ))}
      </RecipeCarousel>
    </main>
  );
}
