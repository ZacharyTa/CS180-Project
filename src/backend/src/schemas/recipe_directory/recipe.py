
"""
RECIPE FORMAT:
    Recipe Name
    Instructions
    Nutrition Facts (Carbs, Fats, Proteins, Calories, Vitamins (Optional))
    Image (URL)
    Diet
    Allergens
"""

# Manages individual recipes
class Recipe:
    def __init__(self, name, instructions, nutrition_facts, diet):
        self._name = name
        self._instructions = instructions
        self._nutrition_facts = nutrition_facts
        self._diet = diet
    
    

