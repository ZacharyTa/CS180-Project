"use client";

import Account from "@/components/Account";
import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import RecipeCard from "@/components/recipe-card";
import TabBar from "@/components/tab-bar";
import {
  getLikedRecipes,
  setDietPreference,
  getDietPreference,
} from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { DietPreference } from "@/lib/types/diet";
import Box from "@/components/test-recipe";
import DietaryForm from "@/components/diet-form";

export default function ProfilePage() {
  const { user, session } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // State for modal
  const [boxModalOpen, setBoxModalOpen] = useState(false); // Controls modal visibility
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [dietLoading, setDietLoading] = useState(false);
  const [userDietPreference, setUserDietPreference] =
    useState<DietPreference>();

  useEffect(() => {
    if (user === null) {
      return;
    }
    const fetchLikedRecipes = async () => {
      try {
        const recipes = await getLikedRecipes(user.id); // Fetch liked recipes
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

  const openDietModal = async () => {
    if (user) {
      setUserDietPreference(await getDietPreference(user.id));
    }

    setDietModalOpen(true);
  };

  const closeDietModal = () => {
    setDietModalOpen(false);
  };

  const handleFormSubmit = async ({
    dietaryPreference,
    allergies,
  }: {
    dietaryPreference: string;
    allergies: string[];
  }) => {
    setDietLoading(true);
    if (user === null) {
      return;
    }
    try {
      const dietPreferencePayload: DietPreference = {
        userId: user.id,
        dietaryPreference,
        allergensList: allergies,
      };

      const response = await setDietPreference(dietPreferencePayload);
      console.log("Response:", response);
      // TODO add toast message to show response
    } catch (error) {
      console.error("Error fetching liked recipes:", error);
    } finally {
      setDietLoading(false);
      closeDietModal();
    }
  };

  if (user === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TabBar />

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

      <div className="pt-32 pb-6 px-1">
        <div className="grid grid-cols-3 gap-4">
          {user &&
            likedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.recipeName}
                imgUrl={recipe.imageURL}
                onClick={() => openBoxModal(recipe)}
              />
            ))}
        </div>
      </div>

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
              initialDietaryPreference={userDietPreference?.dietaryPreference}
              initialAllergies={userDietPreference?.allergensList}
              onSubmit={handleFormSubmit}
              loading={dietLoading}
            />
          </div>
          <div className="modal-backdrop" onClick={closeDietModal}></div>
        </dialog>
      )}

      {boxModalOpen && selectedRecipe && (
        <dialog id="recipe-modal" className="modal modal-open">
          <div className="modal-box w-8/12 h-3/4">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={closeBoxModal}
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
              allergensList={selectedRecipe.allergensList}
              userId={user?.id}
              isProfile={true}
            />
          </div>
          <div className="modal-backdrop" onClick={closeBoxModal}></div>
        </dialog>
      )}
    </div>
  );
}
