# FastAPI application entry point
from fastapi import FastAPI
from src.api.routes import recipes, user

app = FastAPI()

app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["Recipes"])
app.include_router(user.router, prefix="/api/v1/user", tags=["User"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Recipe App API!"}
