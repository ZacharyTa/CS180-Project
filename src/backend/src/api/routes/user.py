# Recipes fastapi router

from fastapi import APIRouter

router = APIRouter()

# Example endpoint to fetch all recipes
@router.get("/", response_model=str)
async def get_user_id():
    dummy_user_id = "123"
    return dummy_user_id

# env activate       Print the command to activate a virtual environment.
#   env info           Displays information about the current environment.
#   env list           Lists all virtualenvs associated with the current project.
#   env remove         Remove virtual environments associated with the project.
#   env use            Activates or creates a new virtualenv for the current project.

# ZACH: REMOVE THIS?