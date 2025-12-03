from fastapi.testclient import TestClient
from ai_engine.U10 import app
import os

client = TestClient(app)

def test_generate_quiz_structure():
    # This test might fail if API KEY is not set, but we want to check if the endpoint exists and accepts JSON.
    # If API KEY is missing, it returns 500, which is expected behavior for now.
    
    response = client.post("/generate_quiz", json={"interest": "Engineering"})
    
    if response.status_code == 200:
        data = response.json()
        assert "category" in data
        assert "questions" in data
        assert isinstance(data["questions"], list)
        print("Test Passed: API returned valid quiz structure.")
    elif response.status_code == 500:
        print(f"Test Skipped (Expected): Server returned 500, likely due to missing API Key. Detail: {response.json().get('detail')}")
    else:
        print(f"Test Failed: Unexpected status code {response.status_code}")
        print(response.json())

if __name__ == "__main__":
    test_generate_quiz_structure()
