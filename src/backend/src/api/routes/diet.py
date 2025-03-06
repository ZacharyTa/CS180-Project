from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from src.db.diet_client import DietPreferenceClient
from src.schemas.diet import DietPreference

router = APIRouter()

class Status(BaseModel):
    message: str
    status_code: int

class UserDietPayload(BaseModel):
    user_id: str = Field(..., alias="userId")
    diet_preference: str | None = Field(..., alias="dietaryPreference")
    allergies: list[str] | None = Field(..., alias="allergensList")

@router.post("/set_preference", response_model=Status)
async def set_user_diet_preference(request: UserDietPayload):
    diet_client = DietPreferenceClient(user_id=request.user_id)
    payload = DietPreference(
        user_id=request.user_id,
        diet_preference=request.diet_preference,
        allergies=request.allergies
    )
    response = await diet_client.set_user_diet_preference(payload)

    return {"message": "Success", "status_code": 200}

@router.get("/get_preference", response_model=DietPreference)
async def get_user_diet_preference(user_id: str = Query(..., alias="userId")):
    print(f"IM HERER AR: {user_id}")
    diet_client = DietPreferenceClient(user_id=user_id)
    response = await diet_client.get_user_diet_preference()

    print(f"SDADASDASDAD: {response}")

    return response