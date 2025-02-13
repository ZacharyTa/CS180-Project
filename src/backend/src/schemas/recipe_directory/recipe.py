
"""
RECIPE FORMAT:
    Recipe Name
    Instructions
    Nutrition Facts (Carbs, Fats, Proteins, Calories, Vitamins (Optional))
    Image (URL)
    Diet
    Allergens
"""

# Manages the information of individual recipes.
class Recipe:
    # Initializer for recipe
    def __init__(self, name, instructions, nutrition_facts, ingredients, diet, image):
        self._name = name
        self._instructions = instructions
        self._nutrition_facts = nutrition_facts
        self._ingredients = ingredients
        self._diet = diet
        self._image = image
    
    def get_name(self):
        return self._name
    
    def get_instructions(self):
        return self._instructions
    
    def get_nutrition_facts(self):
        return self._nutrition_facts
    
    def get_ingredients(self):
        return self._ingredients
    
    def get_diet(self):
        return self._diet
    
    def get_image(self):
        return self._image