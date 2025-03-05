from dataclasses import dataclass, field, asdict
from typing import Optional

@dataclass 
class Recipe:
  id: int
  name: str
  cooking_instructions: str
  image_url: str
  calories: float
  proteins: float
  fats: float
  carbs: float
  allergens_list: Optional[list[str]] = field(default_factory=list)

  def to_dict(self):
      return {
          "id": self.id,
          "recipeName": self.name,
          "cookingInstructions": self.cooking_instructions,
          "imageURL": self.image_url,
          "calories": self.calories,
          "protein": self.proteins,
          "fats": self.fats,
          "carbs": self.carbs,
          "allergensList": self.allergens_list
      }