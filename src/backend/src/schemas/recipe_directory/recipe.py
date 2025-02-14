
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
    def __init__(self, name, instructions, nutrition_facts, ingredients, diet, image_url):
        self.__name = name
        self.__instructions = instructions
        self.__nutrition_facts = nutrition_facts
        self.__ingredients = ingredients
        self.__diet = diet
        self.__image_url = image_url
    
    def get_name(self):
        return self.__name
    
    def get_instructions(self):
        return self.__instructions
    
    def get_nutrition_facts(self):
        return self.__nutrition_facts
    
    def get_ingredients(self):
        return self.__ingredients
    
    def get_diet(self):
        return self.__diet
    
    def get_image_url(self):
        return self.__image_url