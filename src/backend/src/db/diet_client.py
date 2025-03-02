import os
import dotenv
from supabase import create_client, Client
from src.schemas.diet import DietPreference

dotenv.load_dotenv()

class DietPreferenceClient:
    """
    A client class to interact with the diet preference data stored in a Supabase database.

    Methods
    -------
    __init__():
        Initializes the DietPreferenceClient with a Supabase client instance.

    async get_user_diet_preference(user_id: str) -> DietPreference:
        Retrieves the diet preference for a given user ID from the Supabase database.
        Parameters:
            user_id (str): The ID of the user whose diet preference is to be retrieved.
        Returns:
            DietPreference: An instance of DietPreference containing the user's diet preference data.

    async set_user_diet_preference(payload: DietPreference) -> DietPreference:
        Sets or updates the diet preference for a given user in the Supabase database.
        Parameters:
            payload (DietPreference): An instance of DietPreference containing the user's diet preference data to be set or updated.
        Returns:
            DietPreference: An instance of DietPreference containing the updated user's diet preference data.
    """
    def __init__(self):
        self.supabase: Client = create_client(supabase_url=os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))

    async def get_user_diet_preference(self, user_id: str):
        user_diet_preference = None

        response = (
            self.supabase.table("diet_preference")
            .select("user_id, diet_preference, allergies")
            .eq("user_id", user_id)
            .execute()
        )

        if len(response.data) > 0:
            user_diet_preference = DietPreference(
                user_id=response.data[0]["user_id"],
                diet_preference=response.data[0]["diet_preference"],
                allergies=response.data[0]["allergies"]
            )

        return user_diet_preference

    async def set_user_diet_preference(self, payload: DietPreference):
        user_diet_preference = None

        response = (
            self.supabase.table("diet_preference")
            .upsert({
                "user_id": payload.user_id,
                "diet_preference": payload.diet_preference,
                "allergies": payload.allergies
            }, on_conflict=["user_id"])
            .execute()
        )

        if len(response.data) > 0:
            user_diet_preference = DietPreference(
                user_id=response.data[0]["user_id"],
                diet_preference=response.data[0]["diet_preference"],
                allergies=response.data[0]["allergies"]
            )

        return user_diet_preference