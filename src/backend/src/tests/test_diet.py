import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from src.api.routes.diet import router
from src.schemas.diet import DietPreference
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)


client = TestClient(app)

@pytest.fixture
def mock_diet_client():
    with patch("src.api.routes.diet.DietPreferenceClient") as mock:
        yield mock

def test_set_user_diet_preference(mock_diet_client):
    mock_instance = mock_diet_client.return_value
    mock_instance.set_user_diet_preference = AsyncMock(return_value=None)

    response = client.post(
        "/set_preference",
        json={"userId": "user123", "dietaryPreference": "High Protein", "allergensList": ["Meat, Dairy"]}
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Success", "status_code": 200}

def test_get_user_diet_preference(mock_diet_client):
    mock_instance = mock_diet_client.return_value
    mock_instance.get_user_diet_preference = AsyncMock(
        return_value=DietPreference(
            user_id="user123", 
            diet_preference="High Protein", 
            allergies=["Meat", "Dairy"]  # note: separate items in the list
        )
    )

    response = client.get("/get_preference", params={"userId": "user123"})

    assert response.status_code == 200
    assert response.json() == {
        "user_id": "user123",
        "diet_preference": "High Protein",
        "allergies": ["Meat", "Dairy"]
    }

# TODO: Add more tests for setting/getting no user diet preference