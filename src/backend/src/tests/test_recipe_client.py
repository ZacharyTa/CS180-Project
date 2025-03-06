import pytest
from unittest.mock import MagicMock, AsyncMock, patch
import numpy as np
from src.db.recipe_client import RecipeClient
from src.schemas.recipe import Recipe
from src.schemas.diet import DietPreference
from postgrest.base_request_builder import APIResponse, SingleAPIResponse

@pytest.fixture
def mock_supabase():
    return MagicMock()

@pytest.mark.asyncio
async def test_get_latest_embedding_exists():
    user_id = 123
    mock_recipe_data = {"recipe_id": 111}
    mock_embedding = {"name_embedding":[0.1, 0.2, 0.3]}
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value = APIResponse(data=[mock_recipe_data])
        client.supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = SingleAPIResponse(data=mock_embedding)

        result = await client._get_latest_embedding("user_recipes")
        assert result == mock_embedding["name_embedding"]

@pytest.mark.asyncio
async def test_get_recipe_with_diet_preference():
    user_id = 123
    mock_recipes = [{
        "id": 1, "name": "Test", "cooking_instructions": "Bake", 
        "image_url": "test.jpg", "calories": 500, "proteins": 30,
        "fats": 10, "carbs": 40, "allergens_list": [], "name_embedding": [0.1, 0.2]
    }]
    diet_pref = DietPreference(
        user_id="user123",
        diet_preference="High Protein",
        allergies=["Nuts"]
    )
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client._get_latest_embedding = AsyncMock(side_effect=[[0.3, 0.4], None])
        client.supabase.table.return_value.select.return_value.not_.in_.return_value.or_.return_value.order.return_value.limit.return_value.execute.return_value = APIResponse(data=mock_recipes)

        result = await client.get_recipe([], diet_pref)
        
        assert len(result) == 1
        assert isinstance(result[0], Recipe)
        client.supabase.table.return_value.select.assert_called_once()

@pytest.mark.asyncio
async def test_like_recipe_success():
    user_id = 123
    recipe_id = 456
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = APIResponse(data=[{}])

        result = await client.like_recipe(recipe_id)
        assert result is True

@pytest.mark.asyncio
async def test_unlike_recipe_failure():
    user_id = 123
    recipe_id = 456
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.side_effect = Exception("DB error")

        result = await client.unlike_recipe(recipe_id)
        assert result is False

@pytest.mark.asyncio
async def test_get_likes_empty():
    user_id = 123
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = APIResponse(data=[])

        result = await client.get_likes()
        assert len(result) == 0

def test_get_sort_preference():
    # Test known preferences
    assert RecipeClient._get_sort_preference(None, "High Protein") == ("proteins", True)
    assert RecipeClient._get_sort_preference(None, "Low Carb") == ("carbs", False)
    
    # Test unknown preference
    assert RecipeClient._get_sort_preference(None, "Unknown") == (None, False)

@pytest.mark.asyncio
async def test_allergy_filtering():
    user_id = "user123"
    diet_pref = DietPreference(
        user_id=user_id,
        diet_preference="High Protein",
        allergies=["Nuts"]
    )
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        
        await client.get_recipe([], diet_pref)
        
        # Verify allergy filter was applied
        query = client.supabase.table.return_value.select.return_value.not_.in_.return_value.or_
        assert "allergens_list.not.ov.{Nuts}" in str(query.call_args)

@pytest.mark.asyncio
async def test_dislike_recipe_success():
    user_id = 123
    recipe_id = 456
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = APIResponse(data=[{}])

        result = await client.dislike_recipe(recipe_id)
        
        # Verify correct table and method calls
        client.supabase.table.assert_called_with("user_disliked_recipes")
        client.supabase.table.return_value.upsert.assert_called_once_with(
            {"user_id": user_id, "recipe_id": recipe_id},
            ignore_duplicates=False
        )
        assert result is True

@pytest.mark.asyncio
async def test_dislike_recipe_failure():
    user_id = 123
    recipe_id = 789
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.side_effect = Exception("DB error")

        result = await client.dislike_recipe(recipe_id)
        assert result is False

@pytest.mark.asyncio
async def test_undislike_recipe_success():
    user_id = 123
    recipe_id = 456
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value = APIResponse(data=[])

        result = await client.undislike_recipe(recipe_id)
        
        client.supabase.table.assert_called_with("user_disliked_recipes")
        client.supabase.table.return_value.delete.return_value.eq.assert_any_call("user_id", user_id)
        assert result is True

@pytest.mark.asyncio
async def test_like_recipe_duplicate_entry():
    user_id = 123
    recipe_id = 456
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.side_effect = Exception("Duplicate key")

        result = await client.like_recipe(recipe_id)
        assert result is False

@pytest.mark.asyncio
async def test_get_likes_with_multiple_recipes():
    user_id = 123
    mock_recipes = [
        {
            "id": 1, "name": "Recipe 1", "cooking_instructions": "Boil",
            "image_url": "img1.jpg", "calories": 200, "proteins": 15,
            "fats": 5, "carbs": 30, "allergens_list": []
        },
        {
            "id": 2, "name": "Recipe 2", "cooking_instructions": "Fry",
            "image_url": "img2.jpg", "calories": 400, "proteins": 20,
            "fats": 15, "carbs": 45, "allergens_list": ["Nuts"]
        }
    ]
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = APIResponse(data=mock_recipes)

        result = await client.get_likes()
        
        assert len(result) == 2
        assert result[0].id == 1
        assert result[1].name == "Recipe 2"
        assert all(isinstance(recipe, Recipe) for recipe in result)

@pytest.mark.asyncio
async def test_unlike_recipe_success_no_matching_record():
    user_id = 123
    recipe_id = 999  # Non-existent recipe
    
    with patch.object(RecipeClient, "__init__", lambda self, user_id: None):
        client = RecipeClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        # Successful execution with no data
        client.supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value = APIResponse(data=[])

        result = await client.unlike_recipe(recipe_id)
        assert result is True  # Should return True even if no record found