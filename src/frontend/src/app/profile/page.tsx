"use client";

import Account from "@/components/Account";
import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import RecipeCard from "@/components/recipe-card";
import TabBar from "@/components/tab-bar";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import Box from "@/components/test-recipe";
import DietaryForm from "@/components/diet-form";

export default function ProfilePage() {
  const { user, session } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // State for modal
  const [boxModalOpen, setBoxModalOpen] = useState(false); // Controls modal visibility
  const [dietModalOpen, setDietModalOpen] = useState(false);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const recipes = await fetchRecipes(); // Fetch liked recipes
        setLikedRecipes(recipes);
      } catch (error) {
        console.error("Error fetching liked recipes:", error);
      }
    };

    fetchLikedRecipes();
  }, []);

  const openBoxModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setBoxModalOpen(true);
  };

  const closeBoxModal = () => {
    setBoxModalOpen(false);
    setSelectedRecipe(null);
  };

  const openDietModal = () => {
    setDietModalOpen(true);
  };

  const closeDietModal = () => {
    setDietModalOpen(false);
  };

  const handleFormSubmit = (data: {
    dietaryPreference: string;
    allergies: string[];
  }) => {
    console.log("User's selection:", data);
  };

  if (user === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TabBar />

      {/* Fixed header with profile */}
      <div className="flex items-center gap-4 p-4">
        <Account session={session} />
        <div>
          <h1 className="text-lg font-semibold">{user?.email}</h1>
        </div>
      </div>
      <div className="divider" />
      <button className="btn" onClick={openDietModal}>
        My Diet
      </button>

      {/* Scrollable content area with recipe grid */}
      <div className="pt-32 pb-6 px-1">
        <div className="grid grid-cols-3 gap-4">
          {user &&
            likedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.recipeName}
                imgUrl={recipe.imageURL}
                onClick={() => openBoxModal(recipe)} // Open modal on click
              />
            ))}
        </div>
      </div>

      {/* Diet Modal so that users can set diet preference */}
      {dietModalOpen && user && (
        <dialog id="diet-modal" className="modal modal-open">
          <div className="modal-box w-8/12 h-3/4">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeDietModal}
            >
              ✕
            </button>
            <DietaryForm
              initialDietaryPreference="High Protein"
              initialAllergies={["Dairy", "Gluten"]}
              onSubmit={handleFormSubmit}
            />
          </div>
          <div className="modal-backdrop" onClick={closeDietModal}></div>
        </dialog>
      )}

      {/* DaisyUI Modal */}
      {boxModalOpen && selectedRecipe && (
        <dialog id="recipe-modal" className="modal modal-open">
          <div className="modal-box w-8/12 h-3/4">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeBoxModal}
            >
              ✕
            </button>
            {/* Pass selected recipe to Box component */}
            <Box
              id={selectedRecipe.id}
              title={selectedRecipe.recipeName}
              imgUrl={selectedRecipe.imageURL}
              cookingInstructions={selectedRecipe.cookingInstructions}
              calories={selectedRecipe.calories}
              protein={selectedRecipe.protein}
              carbs={selectedRecipe.carbs}
              fats={selectedRecipe.fats}
              userId={user?.id}
            />
          </div>
          <div className="modal-backdrop" onClick={closeBoxModal}></div>
        </dialog>
      )}
    </div>
  );
}
