# Recipe App Backend

FastAPI-based backend server for the recipe application.

## Prerequisites

- Python 3.13.1
- Poetry (Python package manager)

## Setup Instructions

1. Install Python 3.13.1 (if on windows, make a venv now with Python 3.13.1 with `py -3.13 -m venv .venv` then `.venv\Scripts\activate`)

2. Install Poetry

- `pip install poetry`

3. Navigate to backend directory

- `cd src/backend`

4. Set up poetry to create a virtual environment in the project directory:

- `poetry config --local virtualenvs.in-project true`

5. Run poetry to install dependencies:

- `poetry install`
- This will create a virtual environment and install dependencies

6. activate a virtual environment:

   ```bash
   source .venv/bin/activate
   ```

7. . Start the server with uvicorn:

- `uvicorn src.main:app --reload`
- `poetry run uvicorn src.main:app --reload` if above command fails
- The server will start at http://127.0.0.1:8000

## API Doc

- Once the server is running, you can:

- Access the API documentation at http://127.0.0.1:8000/docs
- View OpenAPI specification at http://127.0.0.1:8000/openapi.json

### Available Endpoints

- Diet API: http://127.0.0.1:8000/api/v1/diet/
- Recipes API: http://127.0.0.1:8000/api/v1/recipes/

## Running Tests

- Run tests with the following command:
- `poetry run pytest`
