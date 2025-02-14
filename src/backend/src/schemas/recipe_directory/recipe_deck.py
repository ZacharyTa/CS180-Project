import random

# This class is responsible for managing all the recipes in the deck
class RecipeDeck:
    # Initializes the Recipe Deck
    def __init__(self, initial_container=[]):
        self.__container = initial_container

    # Adds a new recipe at the end of the deck
    def append_recipe(self, recipe):
        self.__container.append(recipe)
    
    # Adds a new recipe at the beginning of the deck
    def prepend_recipe(self, recipe):
        self.__container.insert(0, recipe)

    # Shuffles the recipe deck
    def shuffle_deck(self):
        random.shuffle(self.__container)

    # Obtains random card from deck of recipes
    def obtain_wild_card(self):
        index = random.randint(0, len(self.__container) - 1)
        return self.__container[index]
    
    # Removes the recipe at the front of the deck
    def remove_front_recipe(self):
        return self.__container.pop(0)
    
    # Removes the recipe at the end of the deck
    def remove_back_recipe(self):
        return self.__container.pop()
    
    # Removes recipe at a particular index, if needed
    def remove_recipe_at_index(self, index):
        return self.__container.pop(index)