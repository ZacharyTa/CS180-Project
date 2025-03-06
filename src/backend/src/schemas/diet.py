from dataclasses import dataclass

@dataclass
class DietPreference:
    user_id: str
    diet_preference: str
    allergies: list[str]

    def to_dict(self):
      return {
          "user_id": self.user_id,
          "diet_preference": self.diet_preference,
          "allergies": self.allergies
      }