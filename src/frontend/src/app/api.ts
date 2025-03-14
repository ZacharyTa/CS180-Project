import { Recipe } from "@/lib/types/recipe";
import { DietPreference } from "@/lib/types/diet";

// Fetch recipes from our own fastAPI api

export const fetchRecipes = async (
  userId: string,
  recipeList: number[]
): Promise<Recipe[]> => {
  console.log("Fetching recipeList", recipeList);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/get_recipes/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, recipeList }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const data: Recipe[] = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return an empty array or handle the error appropriately
  }
};

export const getLikedRecipes = async (userId: string): Promise<Recipe[]> => {
  console.log("Fetching liked recipes");
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/recipes/get_liked_recipes/?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch liked recipes");
    }
    const data: Recipe[] = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching liked recipes:", error);
    return [];
  }
};

export const likeRecipe = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  console.log("Liking Recipe", recipeId);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/like_recipe/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, recipeId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like recipe");
    }
    return true;
  } catch (error) {
    console.error("Error liking recipe:", error);
    return false;
  }
};

export const unlikeRecipe = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  console.log("Unliking Recipe", recipeId);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/unlike_recipe/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, recipeId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to unlike recipe");
    }
    return true;
  } catch (error) {
    console.error("Error unliking recipe:", error);
    return false;
  }
};

export const dislikeRecipe = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  console.log("disLiking Recipe", recipeId);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/dislike_recipe/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, recipeId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like recipe");
    }
    return true;
  } catch (error) {
    console.error("Error liking recipe:", error);
    return false;
  }
};

export const undislikeRecipe = async (
  userId: string,
  recipeId: number
): Promise<boolean> => {
  console.log("UnDisliking Recipe", recipeId);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/recipes/undislike_recipe/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, recipeId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to undislike recipe");
    }
    return true;
  } catch (error) {
    console.error("Error undisliking recipe:", error);
    return false;
  }
};

export const setDietPreference = async (
  data: DietPreference
): Promise<boolean> => {
  console.log("Setting Diet Preference", data);
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/diet/set_preference/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to set diet preference");
    }
    return true;
  } catch (error) {
    console.error("Error setting diet preference:", error);
    return false;
  }
};

export const getDietPreference = async (
  userId: string
): Promise<DietPreference> => {
  console.log("Getting Diet Preference", userId);
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/diet/get_preference/?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to set diet preference");
    }

    const responseData = await response.json();
    const dietPreference: DietPreference = {
      userId: responseData["user_id"],
      dietaryPreference: responseData["diet_preference"],
      allergensList: responseData["allergies"],
    };
    console.log("Diet Preference:", dietPreference);
    return dietPreference;
  } catch (error) {
    console.error("Error setting diet preference:", error);

    const dietPreferenceFallback: DietPreference = {
      userId,
      dietaryPreference: "",
      allergensList: [],
    };
    return dietPreferenceFallback;
  }
};
