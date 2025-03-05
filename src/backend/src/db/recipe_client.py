import os
import dotenv
from supabase import create_client, Client
from src.schemas.recipe import Recipe

from postgrest.base_request_builder import APIResponse

dotenv.load_dotenv()

class RecipeClient:
    
    def __init__(self):
        self.supabase: Client = create_client(supabase_url=os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))

    async def get_recipe(self, recipe_id_list: list[int]) -> list[Recipe]:
        recipe_batch: list[Recipe] = []

        response = (
            self.supabase.table("recipe")
            .select("*")
            .not_.in_("id", recipe_id_list)
            .limit(10)
            .execute()
        )

        if len(response.data) > 0:
            for recipe in response.data:
                recipe_batch.append(Recipe(
                    id = recipe["id"],
                    name = recipe["name"],
                    cooking_instructions = recipe["cooking_instructions"],
                    image_url = recipe["image_url"],
                    calories = recipe["calories"],
                    proteins = recipe["proteins"],
                    fats = recipe["fats"],
                    carbs = recipe["carbs"],
                    allergens_list = recipe["allergens_list"]
                ))

        return recipe_batch
