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

    payload = {
        "userId": "user123",
        "dietaryPreference": "High Protein",
        "allergensList": ["Meat", "Dairy"]
    }

    response = client.get("/get_preference", params=payload)

    assert response.status_code == 200
    assert response.json() == {
        "user_id": "user123",
        "diet_preference": "High Protein",
        "allergies": ["Meat", "Dairy"]
    }

async def test_get_user_diet_preference_not_found(mock_diet_client):
    mock_instance = mock_diet_client.return_value
    mock_instance.get_user_diet_preference = AsyncMock(return_value=None)

    payload = {
        "userId": "user123",
        "dietaryPreference": "High Protein",
        "allergensList": ["Meat", "Dairy"]
    }

    response = client.get("/invalid_endpoint", params=payload)
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}

def test_get_user_diet_preference_missing_user_id(mock_diet_client):
    response = client.get("/get_preference")
    
    assert response.status_code == 422
    assert "userId" in str(response.json()["detail"])

def test_set_user_diet_preference_invalid_payload_missing_user_id(mock_diet_client):
    response = client.post(
        "/set_preference",
        json={"dietaryPreference": "High Protein", "allergensList": ["Meat"]}
    )
    
    assert response.status_code == 422
    assert "userId" in str(response.json()["detail"])

def test_set_user_diet_preference_invalid_allergies_type(mock_diet_client):
    response = client.post(
        "/set_preference",
        json={"userId": "user123", "dietaryPreference": "High Protein", "allergensList": "Meat"}
    )
    
    assert response.status_code == 422
    assert "allergensList" in str(response.json()["detail"])

def test_set_user_diet_preference_null_diet_empty_allergies(mock_diet_client):
    mock_instance = mock_diet_client.return_value
    mock_instance.set_user_diet_preference = AsyncMock(
        return_value=DietPreference(
            user_id="user123",
            diet_preference=None,
            allergies=[]
        )
    )

    response = client.post(
        "/set_preference",
        json={"userId": "user123", "dietaryPreference": None, "allergensList": []}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Success"

def test_set_user_diet_preference_invalid_diet_type(mock_diet_client):
    response = client.post(
        "/set_preference",
        json={"userId": "user123", "dietaryPreference": 123, "allergensList": []}
    )
    
    assert response.status_code == 422
    assert "dietaryPreference" in str(response.json()["detail"])

def test_set_user_diet_preference_empty_payload(mock_diet_client):
    response = client.post("/set_preference", json={})
    
    assert response.status_code == 422
    assert len(response.json()["detail"]) > 1
