"use client";

import { useState, useCallback } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import RecipeComponent from "@/components/recipe";
import Box from "@/components/test-recipe";

// Function to generate a new Recipe object
const generateRecipe = (id: number) => ({
  id,
  src: `/Recipe${(id % 3) + 1}.mp4`,
});

// Initial Recipes
const initialRecipes = Array.from({ length: 5 }, (_, i) =>
  generateRecipe(i + 1)
);

export default function Home() {
  const [Recipes, setRecipes] = useState(initialRecipes);

  const loadMoreRecipes = useCallback(() => {
    console.log("Loading more recipes");
    const newRecipes = Array.from({ length: 5 }, (_, i) =>
      generateRecipe(Recipes.length + i + 1)
    );
    setRecipes((prevRecipes) => {
      const updatedRecipes = [...prevRecipes, ...newRecipes];
      console.log("Updated Recipes length:", updatedRecipes.length);
      // Keep only the last 20 Recipes
      //return updatedRecipes.slice(-20) # key error here bc we manually create the recipe id
      return updatedRecipes;
    });
  }, [Recipes.length]);

  return (
    <main className="h-screen w-full bg-black">
      <RecipeCarousel onLastSlide={loadMoreRecipes}>
        {Recipes.map((Recipe) => (
          // <RecipeComponent key={Recipe.id} src={Recipe.src} />
          <Box
            key={Recipe.id}
            title="Spaghetti and Meatballs"
            imgUrl="https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg"
            calories={250}
            protein={10}
            carbs={30}
            fats={8}
          />
        ))}
      </RecipeCarousel>
    </main>
  );
}
