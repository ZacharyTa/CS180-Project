from fastapi import APIRouter
from pydantic import BaseModel, Field
from src.schemas.recipe import Recipe
from src.db.recipe_client import RecipeClient
from typing import Any

router = APIRouter()

class FetchRecipeBatchRequest(BaseModel):
    recipe_id_list: list[int] = Field(..., alias="recipeList")

@router.post("/get_recipes", response_model=list[dict[str, Any]]) # find out how todo: list[Recipe.to_dict()]
async def get_random_recipes(request: FetchRecipeBatchRequest):
    
    recipe_client = RecipeClient()
    recipes = await recipe_client.get_recipe(request.recipe_id_list)
    response = [recipe.to_dict() for recipe in recipes]
    return response

class LikeRecipeRequest(BaseModel):
    user_id: str = Field(..., alias="userId")
    recipe_id: int = Field(..., alias="recipeId")

@router.post("/like_recipe", response_model=bool)
async def like_recipe(request: LikeRecipeRequest):
    print(f"user_id: {request.user_id} -> liked recipe with id {request.recipe_id}!")
    return True # return true if theres no errors

class UnlikeRecipeRequest(BaseModel):
    user_id: str = Field(..., alias="userId")
    recipe_id: int = Field(..., alias="recipeId")

@router.post("/unlike_recipe", response_model=bool)
async def dislike_recipe(request: UnlikeRecipeRequest):
    print(f"user_id: {request.user_id} -> unliked recipe with id {request.recipe_id}!")
    return True