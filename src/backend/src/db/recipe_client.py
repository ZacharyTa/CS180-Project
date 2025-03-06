import os
import dotenv
from supabase import create_client, Client
from src.schemas.recipe import Recipe
from src.schemas.diet import DietPreference

from postgrest.base_request_builder import APIResponse

dotenv.load_dotenv()

class RecipeClient:
    
    def __init__(self, user_id: int) -> None:
        self.supabase: Client = create_client(supabase_url=os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
        self.user_id = user_id

    def _get_sort_preference(self, diet_preference: str) -> tuple[str, bool]:
        preference_map = {
            "High Protein": ("proteins", True),
            "Low Carb": ("carbs", False),
            "Low Fat": ("fats", False),
            "Keto": ("carbs", False),
            "Low Calories": ("calories", False),
        }
        
        return preference_map.get(diet_preference, (None, False)) 


    async def get_recipe(self, recipe_id_list: list[int], diet_pref: DietPreference | None) -> list[Recipe]:
        recipe_batch: list[Recipe] = []
        response = APIResponse(data=[])

        query = (
            self.supabase.table("recipe")
            .select("*")
            .not_.in_("id", recipe_id_list)
        )

        if diet_pref:
            query = query.or_(
                f"allergens_list.is.null, allergens_list.not.ov.{{{','.join(diet_pref.allergies)}}}"
            )


            sort_column, sort_order = self._get_sort_preference(diet_pref.diet_preference)
            if sort_column:
                query = query.order(sort_column, desc=sort_order)  # Sort dynamically

        response = query.limit(10).execute()

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

    
    async def like_recipe(self, recipe_id: int) -> bool:

        try :
            response = (
                self.supabase.table("user_recipes")
                .upsert({"user_id": self.user_id, "recipe_id": recipe_id}, ignore_duplicates=False)
                .execute()
            )

            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
        
    async def unlike_recipe(self, recipe_id: int) -> bool:

        try:
            response = (
                self.supabase.table("user_recipes")
                .delete()
                .eq("user_id", self.user_id)
                .eq("recipe_id", recipe_id)
                .execute()
            )

            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
        
    async def get_likes(self) -> list[Recipe]:
        liked_recipes: list[Recipe] = []

        try:
            response = (
                self.supabase.table("recipe")
                .select("*, user_recipes!inner(recipe_id)") 
                .eq("user_recipes.user_id", self.user_id)
                .limit(10)
                .execute()
            )

            if response.data:
                for recipe in response.data:
                    liked_recipes.append(Recipe(
                        id=recipe["id"],
                        name=recipe["name"],
                        cooking_instructions=recipe["cooking_instructions"],
                        image_url=recipe["image_url"],
                        calories=recipe["calories"],
                        proteins=recipe["proteins"],
                        fats=recipe["fats"],
                        carbs=recipe["carbs"],
                        allergens_list=recipe["allergens_list"]
                    ))
        except Exception as e:
            print(f"Error: {e}")

        return liked_recipes

