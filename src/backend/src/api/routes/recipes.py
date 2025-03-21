from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from src.db.diet_client import DietPreferenceClient
from src.db.recipe_client import RecipeClient
from typing import Any

router = APIRouter()

class FetchRecipeBatchRequest(BaseModel):
    user_id: str = Field(..., alias="userId")
    recipe_id_list: list[int] = Field(..., alias="recipeList")

@router.post("/get_recipes", response_model=list[dict[str, Any]]) # find out how todo: list[Recipe.to_dict()]
async def get_random_recipes(request: FetchRecipeBatchRequest):

    diet_pref_client = DietPreferenceClient(user_id=request.user_id)
    diet_pref = await diet_pref_client.get_user_diet_preference()
    
    recipe_client = RecipeClient(user_id=request.user_id) # aghh hardcode for now
    recipe_list = await recipe_client.get_recipe(request.recipe_id_list, diet_pref)
    response = [recipe.to_dict() for recipe in recipe_list]
    return response

class RecipeRequest(BaseModel):
    user_id: str = Field(..., alias="userId")
    recipe_id: int = Field(..., alias="recipeId")

@router.post("/like_recipe", response_model=bool)
async def like_recipe(request: RecipeRequest):
    
    recipe_client = RecipeClient(user_id=request.user_id)
    response = await recipe_client.like_recipe(request.recipe_id)
    return response

@router.post("/unlike_recipe", response_model=bool)
async def dislike_recipe(request: RecipeRequest):
    
    recipe_client = RecipeClient(user_id=request.user_id)
    response = await recipe_client.unlike_recipe(request.recipe_id)
    return response

# for disliking
@router.post("/dislike_recipe", response_model=bool)
async def dislike_recipe(request: RecipeRequest):
    
    recipe_client = RecipeClient(user_id=request.user_id)
    response = await recipe_client.dislike_recipe(request.recipe_id)
    return response

@router.post("/undislike_recipe", response_model=bool)
async def undislike_recipe(request: RecipeRequest):
    
    recipe_client = RecipeClient(user_id=request.user_id)
    response = await recipe_client.undislike_recipe(request.recipe_id)
    return response


@router.get("/get_liked_recipes", response_model=list[dict[str, Any]])
async def get_likes(user_id: str = Query(..., alias="userId")):# -> list[dict[str, Any]]:
    try:
        recipe_client = RecipeClient(user_id=user_id)
        recipe_list = await recipe_client.get_likes()

        if recipe_list is None:
            raise HTTPException(status_code=404, detail="No liked recipes found")
        
        response = [recipe.to_dict() for recipe in recipe_list]
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    