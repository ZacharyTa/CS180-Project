"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Account from "@/components/Account";
import { useAuth } from "@/context/authContext";
import RecipeCard from "@/components/recipe-card";
import { fetchRecipes } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import Box from "@/components/test-recipe";
import Link from "next/link";
import { Home, Heart, LogOut } from "lucide-react"; 

export default function ProfilePage() {
  const { user, session } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 
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

  if (user === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Tab Bar */}
      <div className="fixed top-0 w-full bg-[#0a0a1a] bg-opacity-80 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white border-opacity-20">
        <div className="flex-grow flex justify-center gap-48">
          <Link href="/fyp" className="flex flex-col items-center text-white">
            <Heart size={20} />
            <span className="text-sm font-bold">For You</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-white">
            <Home size={20} />
            <span className="text-sm font-bold">Profile</span>
          </Link>
        </div>

        <button onClick={handleLogout} className="text-white flex items-center mr-4">
          <LogOut size={15} className="mr-2" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>

      {/* Profile Section*/}
      <div className="flex flex-col items-start mt-24 ml-20">
        {/* Profile Picture with Circle Frame */}
        <div
          className="w-36 h-36 rounded-full border-8 border-grey shadow-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition mt-7"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Account session={session} />
        </div>

        {/* Dropdown for "Edit Profile Pic"*/}
        {showDropdown && (
          <div className="mt-2 bg-white shadow-lg p-2 rounded-md">
            <button className="text-black text-sm font-semibold">Edit Profile Pic</button>
          </div>
        )}

        {/* User Email Below Profile Picture */}
        <h1 className="text-lg font-semibold text-navy-300 mt-3">{user?.email}</h1>
      </div>

      {/* Scrollable Content Area for Liked Recipes */}
      <div className="pt-32 pb-6 px-1">
        <div className="grid grid-cols-3 gap-4">
          {user &&
            likedRecipes.map((recipe) => (
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
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeModal}
            >
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
