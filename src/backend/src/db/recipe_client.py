import os
import dotenv
from supabase import create_client, Client
from src.schemas.recipe import Recipe
from src.schemas.diet import DietPreference
import numpy as np
import json

from postgrest.base_request_builder import APIResponse

dotenv.load_dotenv()

class RecipeClient:
    
    def __init__(self, user_id: int) -> None:
        self.supabase: Client = create_client(supabase_url=os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
        self.user_id = user_id

    def _to_numpy(embedding):
        if not embedding:
            return None
        if isinstance(embedding, str):
            embedding = json.loads(embedding)
        return np.array(embedding, dtype=np.float32)

    def _get_sort_preference(self, diet_preference: str) -> tuple[str, bool]:
        preference_map = {
            "High Protein": ("proteins", True),
            "Low Carb": ("carbs", False),
            "Low Fat": ("fats", False),
            "Keto": ("carbs", False),
            "Low Calories": ("calories", False),
        }
        
        return preference_map.get(diet_preference, (None, False)) 
    
    async def _get_latest_embedding(self, table_name: str) -> list[float] | None:
        try:
            response = (
                self.supabase.table(table_name)
                .select("recipe_id")
                .eq("user_id", self.user_id)
                .order("id", desc=True)
                .limit(1)
                .execute()
            )

            if not response.data:
                return None

            latest_recipe_id = response.data[0]["recipe_id"]

            embedding_response = (
                self.supabase.table("recipe")
                .select("name_embedding")
                .eq("id", latest_recipe_id)
                .single()
                .execute()
            )

            return embedding_response.data["name_embedding"] if embedding_response.data else None

        except Exception as e:
            print(f"Error fetching embedding from {table_name}: {e}")
            return None

    async def get_recipe(self, recipe_id_list: list[int], diet_pref: DietPreference | None) -> list[Recipe]:

        liked_embedding = await self._get_latest_embedding("user_recipes")
        disliked_embedding = await self._get_latest_embedding("user_disliked_recipes")
        
        weight_liked = 0.7
        weight_disliked = 0.3

        query = (
            self.supabase.table("recipe")
            .select("id, name, cooking_instructions, image_url, calories, proteins, fats, carbs, allergens_list, name_embedding")
            .not_.in_("id", recipe_id_list)
        )

        if diet_pref:
            query = query.or_(
                f"allergens_list.is.null, allergens_list.not.ov.{{{','.join(diet_pref.allergies)}}}"
            )


            sort_column, sort_order = self._get_sort_preference(diet_pref.diet_preference)
            if sort_column:
                query = query.order(sort_column, desc=sort_order)  # Sort dynamically

        # fetch batch of recipes catering to user's diet pref
        response = query.limit(50).execute() 

        if not response.data:
            return []

        liked_embedding = self._to_numpy(liked_embedding)
        disliked_embedding = self._to_numpy(disliked_embedding)

        scored_recipes = []

        for recipe in response.data:
            recipe_embedding = self._to_numpy(recipe["name_embedding"])

            if recipe_embedding is None:
                continue 

            liked_similarity = (
                np.dot(recipe_embedding, liked_embedding) / (np.linalg.norm(recipe_embedding) * np.linalg.norm(liked_embedding))
                if liked_embedding is not None else 0
            )

            disliked_similarity = (
                np.dot(recipe_embedding, disliked_embedding) / (np.linalg.norm(recipe_embedding) * np.linalg.norm(disliked_embedding))
                if disliked_embedding is not None else 0
            )

            score = (weight_liked * liked_similarity) + (weight_disliked * (1 - disliked_similarity))
            
            scored_recipes.append((recipe, score))

        scored_recipes.sort(key=lambda x: x[1], reverse=True)

        top_recipes = [Recipe(
            id=r["id"],
            name=r["name"],
            cooking_instructions=r["cooking_instructions"],
            image_url=r["image_url"],
            calories=r["calories"],
            proteins=r["proteins"],
            fats=r["fats"],
            carbs=r["carbs"],
            allergens_list=r["allergens_list"]
        ) for r, _ in scored_recipes[:10]]

        return top_recipes

    
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
        
    async def dislike_recipe(self, recipe_id: int) -> bool:
        
        try:
            response = (
                self.supabase.table("user_disliked_recipes")
                .upsert({"user_id": self.user_id, "recipe_id": recipe_id}, ignore_duplicates=False)
                .execute()
            )

            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
        
    async def undislike_recipe(self, recipe_id: int) -> bool:
        
        try:
            response = (
                self.supabase.table("user_disliked_recipes")
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

