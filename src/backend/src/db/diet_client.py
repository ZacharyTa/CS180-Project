import os
import dotenv
from supabase import create_client, Client
from src.schemas.diet import DietPreference

dotenv.load_dotenv()

class DietPreferenceClient:
    """
    Handles saving and getting people's diet choices from the database
    Remembers stuff like diet preferences(keto, high protein, ...) or food allergies using Supabase

    Attributes
    ----------
    supabase : Client
        The connection to Supabase we use to talk to the database
    user_id : str
        Which user we're dealing with (their unique ID)

    Methods
    -------
    __init__(user_id: str):
        Sets up the client. Needs the user's ID to know whose diet stuff to manage

    async get_user_diet_preference() -> DietPreference:
        Gets what this user likes to eat and what they're allergic to
        If they don't have any saved preferences yet, makes a new empty entry for them
        Returns:
            DietPreference: Their diet settings wrapped in a DietPreference object

    async set_user_diet_preference(payload: DietPreference) -> DietPreference:
        Saves the user's diet choices and allergies. Updates if they already exist,
        creates new if not. Basically their "food rules" storage
        Parameters:
            payload (DietPreference): Their new diet rules to save
        Returns:
            DietPreference: The saved diet rules as confirmation
    """
    def __init__(self, user_id: str):
        self.supabase: Client = create_client(supabase_url=os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), supabase_key=os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
        self.user_id = user_id

    async def get_user_diet_preference(self):
        user_diet_preference = None

        response = (
            self.supabase.table("diet_preference")
            .select("user_id, diet_preference, allergies")
            .eq("user_id", self.user_id)
            .execute()
        )

        if len(response.data) > 0:
            user_diet_preference = DietPreference(
                user_id=response.data[0]["user_id"],
                diet_preference=response.data[0]["diet_preference"],
                allergies=response.data[0]["allergies"]
            )

            return user_diet_preference

        new_entry = {
            "user_id": self.user_id,
            "diet_preference": None,
            "allergies": [] 
        }

        insert_response = (
            self.supabase.table("diet_preference")
            .insert(new_entry)
            .execute()
        )

        if insert_response.data:
            return DietPreference(
                user_id=insert_response.data[0]["user_id"],
                diet_preference=insert_response.data[0]["diet_preference"],
                allergies=insert_response.data[0]["allergies"]
            )

        return None

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