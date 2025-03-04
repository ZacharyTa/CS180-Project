import json
import random
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
import os


router = APIRouter()

# Define the response model
class Recipe(BaseModel):
    id: int
    recipeName: str
    cookingInstructions: str
    imageURL: str
    calories: float
    protein: float
    fats: float
    carbs: float
    allergensList: List[str]


def load_recipes():
    with open("merged_recipes.json", "r", encoding="utf-8") as file:
        return json.load(file)

@router.get("/get_recipes", response_model=List[Recipe])
async def get_random_recipes():
    recipes = load_recipes()
    recipe_names = list(recipes.keys())
    random_recipes = random.sample(recipe_names, min(10, len(recipe_names)))
    
    return [
        {
            "id": recipes[name]["id"],
            "recipeName": recipes[name]["Recipe Name"],
            "cookingInstructions": recipes[name]["Recipe Cooking Instructions"],
            "imageURL": recipes[name]["Recipe Image URL"],
            "calories": recipes[name]["Calories"],
            "protein": recipes[name]["Protein"],
            "fats": recipes[name]["Fats"],
            "carbs": recipes[name]["Carbs"],
            "allergensList": recipes[name]["Allergens list"],
        }
        for name in random_recipes
    ]

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