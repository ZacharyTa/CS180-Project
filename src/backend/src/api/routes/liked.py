from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, UUID4
from supabase import create_client, Client
from dotenv import load_dotenv
import os
app = FastAPI()
load_dotenv()
# Initialize Supabase client
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Recipe model
class Recipe(BaseModel):
    user_id: UUID4
    recipe_id: int

@app.post("/save_recipe")
async def save_recipe(recipe: Recipe):
    # Check if recipe_id already exists
    existing = supabase.table("recipes").select("id").eq("recipe_id", recipe.recipe_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Recipe already saved")

    # Insert new recipe
    response = supabase.table("recipes").insert({
        "user_id": str(recipe.user_id),
        "recipe_id": recipe.recipe_id,
    }).execute()

    return {"message": "Recipe saved successfully", "status": "success"}

@app.get("/get_recipes")
async def get_recipes(user_id: UUID4):
    response = supabase.table("recipes").select("*").eq("user_id", str(user_id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No recipes found")

    return {"recipes": response.data, "status": "success"}
