import json
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Define the response model
class Recipe(BaseModel):
    id: str
    recipeName: str
    recipeCookingInstructions: str
    recipeImageURL: str
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
            "Recipe_ID": recipes[name]["ID"],
            "Recipe_Name": recipes[name]["Recipe Name"],
            "Recipe_Cooking_Instructions": recipes[name]["Recipe Cooking Instructions"],
            "Recipe_Image_URL": recipes[name]["Recipe Image URL"],
            "Calories": recipes[name]["Calories"],
            "Protein": recipes[name]["Protein"],
            "Fats": recipes[name]["Fats"],
            "Carbs": recipes[name]["Carbs"],
            "Allergens_list": recipes[name]["Allergens list"],
        }
        for name in random_recipes
    ]
