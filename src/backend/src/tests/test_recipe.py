import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from src.api.routes.recipes import router
from src.schemas.recipe import Recipe
from src.schemas.diet import DietPreference
from fastapi import FastAPI
import json

app = FastAPI()
app.include_router(router)
client = TestClient(app)

@pytest.fixture
def mock_recipe_client():
    with patch("src.api.routes.recipes.RecipeClient") as mock:
        yield mock

def test_like_recipe_success(mock_recipe_client):
    mock_instance = mock_recipe_client.return_value
    mock_instance.like_recipe = AsyncMock(return_value=True)

    response = client.post(
        url="/like_recipe",
        json={"userId": "123", "recipeId": 456}
    )

    print(f"Response: {response}")

    assert response.status_code == 200
    assert response.json() == True

def test_like_recipe_invalid_input(mock_recipe_client):
    response = client.post(
        "/like_recipe",
        json={"userId": "invalid", "recipeId": "abc"}  # Invalid types
    )
    
    assert response.status_code == 422
    assert "recipeId" in str(response.json()["detail"])

def test_unlike_recipe_success(mock_recipe_client):
    mock_instance = mock_recipe_client.return_value
    mock_instance.unlike_recipe = AsyncMock(return_value=True)

    response = client.post(
        "/unlike_recipe",
        json={"userId": "123", "recipeId": 456}
    )

    assert response.status_code == 200
    assert response.json() == True

def test_dislike_recipe_success(mock_recipe_client):
    mock_instance = mock_recipe_client.return_value
    mock_instance.dislike_recipe = AsyncMock(return_value=True)

    response = client.post(
        "/dislike_recipe",
        json={"userId": "123", "recipeId": 456}
    )

    assert response.status_code == 200
    assert response.json() == True

def test_get_likes_success(mock_recipe_client):
    mock_instance = mock_recipe_client.return_value
    mock_recipe = Recipe(
        id=1,
        name="Liked Recipe",
        cooking_instructions="Test instructions",
        image_url="liked.jpg",
        calories=400,
        proteins=25,
        fats=8,
        carbs=35,
        allergens_list=[]
    )
    mock_instance.get_likes = AsyncMock(return_value=[mock_recipe])

    response = client.get(
        "/get_liked_recipes",
        params={"userId": 123}
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert "Liked Recipe" in response.json()[0]["recipeName"]

def test_get_likes_missing_user(mock_recipe_client):
    response = client.get("/get_liked_recipes")
    
    assert response.status_code == 422
    assert "userId" in str(response.json()["detail"])

def test_server_error(mock_recipe_client):
    mock_instance = mock_recipe_client.return_value
    mock_instance.get_likes = AsyncMock(side_effect=Exception("DB error"))

    response = client.get(
        "/get_liked_recipes",
        params={"userId": 123}
    )

    assert response.status_code == 500
    assert "DB error" in response.json()["detail"]

def test_invalid_recipe_id_format(mock_recipe_client):
    response = client.post(
        "/like_recipe",
        json={"userId": 123, "recipeId": "invalid"}
    )
    
    assert response.status_code == 422
    assert "recipeId" in str(response.json()["detail"])

def test_missing_required_fields(mock_recipe_client):
    response = client.post(
        "/dislike_recipe",
        json={"userId": 123}  # Missing recipeId
    )
    
    assert response.status_code == 422
    assert "recipeId" in str(response.json()["detail"])