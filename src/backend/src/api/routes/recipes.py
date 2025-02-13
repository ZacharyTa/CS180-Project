import json
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

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

# Load recipes from JSON file
def load_recipes():

    with open("merged_recipes.json", "r", encoding="utf-8") as file:
        recipes = json.load(file)
    return recipes

@router.get("/get_recipes", response_model=List[Recipe])
async def get_random_recipes():
    recipes = load_recipes()
    recipe_names = list(recipes.keys())
    random_recipes = random.sample(recipe_names, min(10, len(recipe_names)))
    
    return [
        {
            "id": recipes[name]["ID"],
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
