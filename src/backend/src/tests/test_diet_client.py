import pytest
from unittest.mock import MagicMock, patch
from src.db.diet_client import DietPreferenceClient
from src.schemas.diet import DietPreference

from postgrest.base_request_builder import APIResponse

@pytest.mark.asyncio
async def test_get_user_diet_preference():
    user_id = "user123"

    mock_response = APIResponse(data=[
        {
            "user_id": "user123",
            "diet_preference": "High Protein",
            "allergies": ["Meat", "Dairy"]
        }
    ])
    
    with patch.object(DietPreferenceClient, "__init__", lambda x: None):  # Avoid calling real init
        client = DietPreferenceClient()
        client.supabase = MagicMock()
        # Ensure you assign the response data correctly.
        client.supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response

        result = await client.get_user_diet_preference(user_id)

        assert result.user_id == "user123"
        assert result.diet_preference == "High Protein"
        assert result.allergies == ["Meat", "Dairy"]

@pytest.mark.asyncio
async def test_set_user_diet_preference():
    payload = DietPreference(
        user_id="user123",
        diet_preference="High Protein",
        allergies=["Meat, Dairy"]
    )

    mock_response = APIResponse(data=[
        {
            "user_id": "user123",
            "diet_preference": "High Protein",
            "allergies": ["Meat, Dairy"]
        }
    ])

    with patch.object(DietPreferenceClient, "__init__", lambda x: None):
        client = DietPreferenceClient()
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        result = await client.set_user_diet_preference(payload)

        assert result.user_id == "user123"
        assert result.diet_preference == "High Protein"
        assert result.allergies == ["Meat, Dairy"]

# TODO: Add more tests for setting/getting no user diet preference