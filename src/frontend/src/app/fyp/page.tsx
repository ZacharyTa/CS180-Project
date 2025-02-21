"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecipeCarousel from "@/components/recipe-carousel";
import Box from "@/components/test-recipe";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const [Recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();
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
      <div
        role="tablist"
        className="tabs tabs-lifted fixed top-0 z-50 w-full bg-transparent"
      >
        <a
          role="tab"
          className="tab tab-active [--tab-bg:transparent] [--tab-border-color:black] text-black"
        >
          For you
        </a>
        <a
          role="tab"
          className="tab text-gray-500"
          onClick={() => router.push("/profile")}
        >
          Profile
        </a>
      </div>
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
