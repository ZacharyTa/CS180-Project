# Dependencies to install

1. First install poetry I think
   `pip3 install poetry`

2. Then install all dependencies from poetry:
   `poetry install`

3. Run python backend server:
   `poetry run uvicorn src.main:app --reload`

4. (Optional) You can see how it works by going to the url:

   - User restAPI endpoint: `http://127.0.0.1:8000/api/v1/user/`
   - Recipes restAPI endpoint `http://127.0.0.1:8000/api/v1/recipes/`

5. (Optional) You can visually see all restAPI endpoints and testing the outputs/inputs
   `http://127.0.0.1:8000/docs`
