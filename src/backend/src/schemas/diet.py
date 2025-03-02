from dataclasses import dataclass

@dataclass
class DietPreference:
    user_id: str
    diet_preference: str
    allergies: list[str]
