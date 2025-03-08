import {
  fetchRecipes,
  getLikedRecipes,
  likeRecipe,
  unlikeRecipe,
  dislikeRecipe,
  undislikeRecipe,
  setDietPreference,
  getDietPreference,
} from "@/app/api";
import { Recipe } from "@/lib/types/recipe";
import { DietPreference } from "@/lib/types/diet";

describe("API functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
  });

  describe("fetchRecipes", () => {
    it("returns recipes when response is ok", async () => {
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          recipeName: "Test Recipe 1",
          imageURL: "/test1.jpg",
          cookingInstructions: "Do something",
          calories: 100,
          protein: 10,
          carbs: 20,
          fats: 5,
          allergensList: [],
        },
        {
          id: 2,
          recipeName: "Test Recipe 2",
          imageURL: "/test2.jpg",
          cookingInstructions: "Do something else",
          calories: 200,
          protein: 20,
          carbs: 40,
          fats: 10,
          allergensList: ["Gluten"],
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockRecipes,
      });

      const userId = "user-123";
      const recipeList = [1, 2];
      const recipes = await fetchRecipes(userId, recipeList);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/v1/recipes/get_recipes/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, recipeList }),
        })
      );
      expect(recipes).toEqual(mockRecipes);
    });

    it("returns empty array when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const recipes = await fetchRecipes("user-123", [1]);
      expect(recipes).toEqual([]);
    });
  });

  describe("getLikedRecipes", () => {
    it("returns liked recipes when response is ok", async () => {
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          recipeName: "Liked Recipe",
          imageURL: "/liked.jpg",
          cookingInstructions: "Enjoy",
          calories: 150,
          protein: 15,
          carbs: 30,
          fats: 8,
          allergensList: [],
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockRecipes,
      });

      const recipes = await getLikedRecipes("user-123");

      expect(global.fetch).toHaveBeenCalledWith(
        `http://127.0.0.1:8000/api/v1/recipes/get_liked_recipes/?userId=user-123`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(recipes).toEqual(mockRecipes);
    });

    it("returns empty array when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const recipes = await getLikedRecipes("user-123");
      expect(recipes).toEqual([]);
    });
  });

  describe("likeRecipe", () => {
    it("returns true when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      const result = await likeRecipe("user-123", 1);
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/v1/recipes/like_recipe/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user-123", recipeId: 1 }),
        })
      );
    });

    it("returns false when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await likeRecipe("user-123", 1);
      expect(result).toBe(false);
    });
  });

  describe("unlikeRecipe", () => {
    it("returns true when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      const result = await unlikeRecipe("user-123", 1);
      expect(result).toBe(true);
    });

    it("returns false when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await unlikeRecipe("user-123", 1);
      expect(result).toBe(false);
    });
  });

  describe("dislikeRecipe", () => {
    it("returns true when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      const result = await dislikeRecipe("user-123", 1);
      expect(result).toBe(true);
    });

    it("returns false when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await dislikeRecipe("user-123", 1);
      expect(result).toBe(false);
    });
  });

  describe("undislikeRecipe", () => {
    it("returns true when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      const result = await undislikeRecipe("user-123", 1);
      expect(result).toBe(true);
    });

    it("returns false when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await undislikeRecipe("user-123", 1);
      expect(result).toBe(false);
    });
  });

  describe("setDietPreference", () => {
    it("returns true when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      const data: DietPreference = {
        userId: "user-123",
        dietaryPreference: "vegan",
        allergensList: ["nuts"],
      };

      const result = await setDietPreference(data);
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/v1/diet/set_preference/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      );
    });

    it("returns false when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const data: DietPreference = {
        userId: "user-123",
        dietaryPreference: "vegan",
        allergensList: ["nuts"],
      };

      const result = await setDietPreference(data);
      expect(result).toBe(false);
    });
  });

  describe("getDietPreference", () => {
    it("returns diet preference when response is ok", async () => {
      const mockResponseData = {
        user_id: "user-123",
        diet_preference: "vegetarian",
        allergies: ["dairy"],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await getDietPreference("user-123");
      expect(result).toEqual({
        userId: "user-123",
        dietaryPreference: "vegetarian",
        allergensList: ["dairy"],
      });
      expect(global.fetch).toHaveBeenCalledWith(
        `http://127.0.0.1:8000/api/v1/diet/get_preference/?userId=user-123`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("returns fallback diet preference when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await getDietPreference("user-123");
      expect(result).toEqual({
        userId: "user-123",
        dietaryPreference: "",
        allergensList: [],
      });
    });
  });
});
