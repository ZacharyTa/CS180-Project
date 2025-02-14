
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
    
    # Returns name of recipe, which is a string
    def get_name(self):
        return self.__name
    
    # Returns the instructions for the recipe, which is its own class (to be implemented)
    def get_instructions(self):
        return self.__instructions
    
    # Returns the nutrition facts, which is a dictionary
    def get_nutrition_facts(self):
        return self.__nutrition_facts
    
    # Returns the ingredients list, which is a list
    def get_ingredients(self):
        return self.__ingredients
    
    # Returns the diet
    def get_diet(self):
        return self.__diet
    
    # Returns the image url for the recipe.
    def get_image_url(self):
        return self.__image_url