"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar"; // Make sure Avatar.jsx is properly imported
import { useAuth } from "@/context/authContext";
import RecipeCard from "@/components/recipe-card";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import Box from "@/components/test-recipe";
import TabBar from "@/components/tab-bar";

export default function ProfilePage() {
  const { user } = useAuth(); // Ensure `user` is fetched properly
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const recipes = await fetchRecipes();
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

  const handleLogout = () => {
    alert("Signed out successfully!");
    router.push("/login");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Tab Bar */}
      <TabBar onLogout={handleLogout} />

      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-start mt-24 ml-20">

        <Avatar url={user?.id} size={144} onUpload={() => {}} />

        {/* User Email*/}
        <h1 className="text-lg font-semibold text-[#001F3F] mt-3">{user.email}</h1>
      </div>

      {/* Scrollable Content Area for Liked Recipes */}
      <div className="pt-32 pb-6 px-1">
        <div className="grid grid-cols-3 gap-4">
          {likedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.recipeName}
              imgUrl={recipe.imageURL}
              onClick={() => openModal(recipe)}
            />
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {modalOpen && selectedRecipe && (
        <dialog id="recipe-modal" className="modal modal-open">
          <div className="modal-box w-8/12 h-3/4">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>
              ✕
            </button>
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
          <div className="modal-backdrop" onClick={closeModal}></div>
        </dialog>
      )}
    </div>
  );
}
