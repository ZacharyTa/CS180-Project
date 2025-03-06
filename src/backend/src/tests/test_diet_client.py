import pytest
from unittest.mock import MagicMock, patch
from src.db.diet_client import DietPreferenceClient
from src.schemas.diet import DietPreference
from postgrest.base_request_builder import APIResponse

@pytest.mark.asyncio
async def test_get_user_diet_preference_existing_user():
    user_id = "user123"
    mock_data = {
        "user_id": user_id,
        "diet_preference": "High Protein",
        "allergies": ["Meat", "Dairy"]
    }
    mock_response = APIResponse(data=[mock_data])
    
    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response

        result = await client.get_user_diet_preference()

        assert result.user_id == user_id
        assert result.diet_preference == mock_data["diet_preference"]
        assert result.allergies == mock_data["allergies"]

@pytest.mark.asyncio
async def test_get_user_diet_preference_new_user():
    user_id = "user123"
    new_entry = {
        "user_id": user_id,
        "diet_preference": None,
        "allergies": []
    }
    mock_select_response = APIResponse(data=[])
    mock_insert_response = APIResponse(data=[new_entry])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_select_response
        client.supabase.table.return_value.insert.return_value.execute.return_value = mock_insert_response

        result = await client.get_user_diet_preference()

        assert result.user_id == user_id
        assert result.diet_preference is None
        assert result.allergies == []

@pytest.mark.asyncio
async def test_get_user_diet_preference_insert_failure():
    user_id = "user123"
    mock_select_response = APIResponse(data=[])
    mock_insert_response = APIResponse(data=[])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(user_id)
        client.user_id = user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_select_response
        client.supabase.table.return_value.insert.return_value.execute.return_value = mock_insert_response

        result = await client.get_user_diet_preference()

        assert result is None

@pytest.mark.asyncio
async def test_set_user_diet_preference_success():
    payload = DietPreference(
        user_id="user123",
        diet_preference="High Protein",
        allergies=["Meat", "Dairy"]
    )
    mock_response = APIResponse(data=[payload.to_dict()])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(payload.user_id)
        client.user_id = payload.user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        result = await client.set_user_diet_preference(payload)

        assert result.user_id == payload.user_id
        assert result.diet_preference == payload.diet_preference
        assert result.allergies == payload.allergies

@pytest.mark.asyncio
async def test_set_user_diet_preference_upsert_failure():
    payload = DietPreference(
        user_id="user123",
        diet_preference="Vegan",
        allergies=[]
    )
    mock_response = APIResponse(data=[])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(payload.user_id)
        client.user_id = payload.user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        result = await client.set_user_diet_preference(payload)

        assert result is None

@pytest.mark.asyncio
async def test_set_user_diet_preference_with_null_values():
    payload = DietPreference(
        user_id="user123",
        diet_preference=None,
        allergies=[]
    )
    mock_response = APIResponse(data=[payload.to_dict()])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(payload.user_id)
        client.user_id = payload.user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        result = await client.set_user_diet_preference(payload)

        assert result.diet_preference is None
        assert result.allergies == []

@pytest.mark.asyncio
async def test_upsert_conflict_resolution():
    payload = DietPreference(
        user_id="user123",
        diet_preference="Vegetarian",
        allergies=["Nuts"]
    )
    mock_response = APIResponse(data=[payload.to_dict()])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(payload.user_id)
        client.user_id = payload.user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        await client.set_user_diet_preference(payload)

        client.supabase.table.return_value.upsert.assert_called_once_with(
            {
                "user_id": payload.user_id,
                "diet_preference": payload.diet_preference,
                "allergies": payload.allergies
            },
            on_conflict=["user_id"]
        )

@pytest.mark.asyncio
async def test_allergies_multiple_items():
    allergies = ["Peanuts", "Shellfish", "Eggs"]
    payload = DietPreference(
        user_id="user123",
        diet_preference="Paleo",
        allergies=allergies
    )
    mock_response = APIResponse(data=[payload.to_dict()])

    with patch.object(DietPreferenceClient, "__init__", lambda self, user_id: None):
        client = DietPreferenceClient(payload.user_id)
        client.user_id = payload.user_id
        client.supabase = MagicMock()
        client.supabase.table.return_value.upsert.return_value.execute.return_value = mock_response

        result = await client.set_user_diet_preference(payload)

        assert result.allergies == allergies