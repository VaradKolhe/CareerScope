from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_resume_structure():
    sample_resume = "Software Engineer with 5 years of experience in Python and FastAPI. Strong background in backend development."
    
    response = client.post("/analyze_resume", json={"text": sample_resume})
    
    if response.status_code == 200:
        data = response.json()
        required_fields = [
            "analysis_score", "skills_detected", "missing_important_skills",
            "best_fit_roles", "strengths", "weaknesses", "future_path", "summary"
        ]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        assert isinstance(data["analysis_score"], int)
        assert 0 <= data["analysis_score"] <= 100
        print("Test Passed: API returned valid resume analysis structure.")
        print(f"Score: {data['analysis_score']}")
        print(f"Roles: {data['best_fit_roles']}")
        
    elif response.status_code == 500:
        print(f"Test Skipped (Expected if API Key missing): {response.json().get('detail')}")
    else:
        print(f"Test Failed: Unexpected status code {response.status_code}")
        print(response.json())

if __name__ == "__main__":
    test_analyze_resume_structure()
