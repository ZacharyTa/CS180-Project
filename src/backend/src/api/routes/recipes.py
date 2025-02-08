# Recipes fastapi router
from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class Recipe(BaseModel):
    id: int
    title: str
    imgUrl: str
    calories: int
    protein: int
    carbs: int
    fats: int


# Example endpoint to fetch all recipes
@router.get("/", response_model=list[Recipe])
async def get_recipes():
    return [
        {
            "id": random.randint(0, 100000),
            "title": "Spaghetti and Meatballs",
            "imgUrl": "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
            "calories": random.randint(0, 1000),
            "protein": random.randint(0, 100),
            "carbs": random.randint(0, 100),
            "fats": random.randint(0, 100)
        },
        {
            "id": random.randint(0, 100000),
            "title": "Noode tacos",
            "imgUrl": "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
            "calories": random.randint(0, 1000),
            "protein": random.randint(0, 100),
            "carbs": random.randint(0, 100),
            "fats": random.randint(0, 100)
        },
        {
            "id": random.randint(0, 100000),
            "title": "vinegar",
            "imgUrl": "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
            "calories": random.randint(0, 1000),
            "protein": random.randint(0, 100),
            "carbs": random.randint(0, 100),
            "fats": random.randint(0, 100)
        },
        {
            "id": random.randint(0, 100000),
            "title": "pizza",
            "imgUrl": "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg",
            "calories": random.randint(0, 1000),
            "protein": random.randint(0, 100),
            "carbs": random.randint(0, 100),
            "fats": random.randint(0, 100)
        }
    ]

# env activate       Print the command to activate a virtual environment.
#   env info           Displays information about the current environment.
#   env list           Lists all virtualenvs associated with the current project.
#   env remove         Remove virtual environments associated with the project.
#   env use            Activates or creates a new virtualenv for the current project.