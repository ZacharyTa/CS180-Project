# Dependencies to install

1. Use python 3.13.1
2. make virtual env
3. First install poetry I think
   `pip3 install poetry`
4. cd src/backend/

5. Then install all dependencies from poetry:
   `poetry install`

6. Run python backend server:
   `poetry run uvicorn src.main:app --reload`

7. (Optional) You can see how it works by going to the url:

   - User restAPI endpoint: `http://127.0.0.1:8000/api/v1/user/`
   - Recipes restAPI endpoint `http://127.0.0.1:8000/api/v1/recipes/`

8. (Optional) You can visually see all restAPI endpoints and testing the outputs/inputs
   `http://127.0.0.1:8000/docs`
