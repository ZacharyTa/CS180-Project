import pytest
import asyncio
from src.api.routes.recipes import get_random_recipes  # Import your function

@pytest.mark.asyncio
async def test_get_random_recipes_function():
    recipes = await get_random_recipes()  # Call function directly

    assert isinstance(recipes, list), "Response should be a list"
    assert len(recipes) <= 10, "Should return at most 10 recipes"

    for recipe in recipes:
        assert isinstance(recipe, dict), "Each recipe should be a dictionary"
        assert "id" in recipe and isinstance(recipe["id"], int), "Recipe must have an integer ID"
        assert "recipeName" in recipe and recipe["recipeName"], "Recipe name cannot be empty"
        assert "cookingInstructions" in recipe, "Missing cooking instructions"
        assert "imageURL" in recipe and isinstance(recipe["imageURL"], str), "Image URL must be a string"
        assert "calories" in recipe and isinstance(recipe["calories"], (int, float)), "Calories must be a number"
        assert "protein" in recipe and isinstance(recipe["protein"], (int, float)), "Protein must be a number"
        assert "fats" in recipe and isinstance(recipe["fats"], (int, float)), "Fats must be a number"
        assert "carbs" in recipe and isinstance(recipe["carbs"], (int, float)), "Carbs must be a number"
        assert "allergensList" in recipe and isinstance(recipe["allergensList"], list), "Allergens list must be a list"

# Run the test
if __name__ == "__main__":
    asyncio.run(test_get_random_recipes_function())
