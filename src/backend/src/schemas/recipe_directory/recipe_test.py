import pytest
from recipe import Recipe
from instructions import Instructions
from recipe_deck import RecipeDeck

class RecipeTest:
    def test_empty_recipe():
        r = Recipe()
        assert r.get_diet() == ""
        assert r.get_image_url() == ""
        assert r.get_ingredients() == []
        assert r.get_instructions() == []
        assert r.get_nutrition_facts() == {}


