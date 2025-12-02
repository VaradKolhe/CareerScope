import os
import json
import typing
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

from resume_analysis import router as resume_router

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

# Initialize FastAPI app
app = FastAPI(title="Quiz Generator API")

app.include_router(resume_router)

# Pydantic Models
class QuizRequest(BaseModel):
    interest: str

class Question(BaseModel):
    id: int
    question: str
    options: typing.List[str]

class QuizResponse(BaseModel):
    category: str
    questions: typing.List[Question]

@app.post("/generate_quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured.")

    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')

        prompt = f"""
        Generate a quiz with 8 to 12 questions based on the interest: "{request.interest}".
        The quiz should evaluate aptitude and interest in this field.
        
        Output strictly valid JSON in the following format:
        {{
          "category": "{request.interest}",
          "questions": [
            {{
              "id": 1,
              "question": "Question text here",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
            }}
          ]
        }}
        
        Do not include any markdown formatting (like ```json ... ```). Just the raw JSON string.
        """

        response = model.generate_content(prompt)
        
        # Clean up response text if it contains markdown code blocks
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        quiz_data = json.loads(response_text.strip())
        
        return quiz_data

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Gemini response as JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
