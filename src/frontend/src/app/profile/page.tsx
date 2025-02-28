"use client";

import Account from "@/components/Account";
import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import RecipeCard from "@/components/recipe-card";
import TabBar from "@/components/tab-bar";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import Box from "@/components/test-recipe"; // Ensure this component is correctly implemented

export default function ProfilePage() {
  const { user, session } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // State for modal
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility

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

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
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

      {/* Scrollable content area with recipe grid */}
      <div className="pt-32 pb-6 px-1">
        <div className="grid grid-cols-3 gap-4">
          {user &&
            likedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.recipeName}
                imgUrl={recipe.imageURL}
                onClick={() => openModal(recipe)} // Open modal on click
              />
            ))}
        </div>
      </div>

      {/* DaisyUI Modal */}
      {modalOpen && selectedRecipe && (
        <dialog id="recipe-modal" className="modal modal-open">
          <div className="modal-box w-8/12 h-3/4">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
            {/* Pass selected recipe to Box component */}
            <Box userId={user?.id} recipe={selectedRecipe} />
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </dialog>
      )}
    </div>
  );
}
