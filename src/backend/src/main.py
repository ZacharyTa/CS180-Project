from fastapi import FastAPI
from src.api.routes import recipes, diet

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
origins = ["http://localhost:3000", "https://dinder-cs180-project.vercel.app/"]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],  
        allow_headers=["*"], 
    )


app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["Recipes"])
app.include_router(diet.router, prefix="/api/v1/diet", tags=["Diet"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Recipe App API!"}
