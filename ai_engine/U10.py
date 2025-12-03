import os
import json
import typing
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

# Initialize FastAPI app
app = FastAPI(title="CareerScope AI Engine")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= DATA MODELS =================

class GenerateRequest(BaseModel):
    subjects: typing.List[str]
    hobbies: typing.List[str]
    grade_level: str

class QuestionObj(BaseModel):
    id: int
    type: str # "Technical" or "Personality"
    question: str
    options: typing.List[str]

class QuizResponse(BaseModel):
    questions: typing.List[QuestionObj]

class QuestionResponse(BaseModel):
    question_text: str
    selected_option: str

class EvaluateRequest(BaseModel):
    profile: GenerateRequest
    responses: typing.List[QuestionResponse]

class CareerSuggestion(BaseModel):
    role: str
    confidence: int  # Percentage (0-100)
    reason: str
    required_skills: typing.List[str]

class EvaluationResponse(BaseModel):
    suggestions: typing.List[CareerSuggestion]
    summary: str

# ================= ENDPOINTS =================

@app.post("/generate_quiz", response_model=QuizResponse)
async def generate_quiz(request: GenerateRequest):
    """
    Generates a mixed quiz with strict grade-level difficulty control.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing.")

    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')

        subjects_str = ", ".join(request.subjects)
        hobbies_str = ", ".join(request.hobbies)

        # --- UPDATED PROMPT WITH STRICT DIFFICULTY CONSTRAINTS ---
        prompt = f"""
        Act as a School Career Counselor for a student in {request.grade_level}.
        
        Create a diagnostic quiz to help identify their ideal career path.
        Student Profile:
        - Favorite Subjects: {subjects_str}
        - Hobbies: {hobbies_str}
        
        REQUIREMENTS:
        1. Generate exactly 10 questions.
        2. Mix "Technical/Aptitude" questions and "Personality" questions.
        
        3. CRITICAL - DIFFICULTY CONTROL:
           - The student is in {request.grade_level}. The technical questions MUST be solvable by a student of this age.
           - If "Class 10": Use basic logic, school-level science (NCERT level), percentages, and simple real-world problem solving. DO NOT use advanced calculus, coding syntax, or complex engineering terms.
           - If "UGrad": You can use industry-standard technical questions.
           
        4. "Technical" questions should test their *aptitude* for the subject (e.g., "If you like Math, solve this simple logic puzzle"), not their memorization.
        5. "Personality" questions should assess their work style (e.g., "Do you prefer working alone or in a team?").
        
        Output STRICT JSON format:
        {{
          "questions": [
            {{
              "id": 1,
              "type": "Technical", 
              "question": "...",
              "options": ["...", "...", "...", "..."]
            }}
          ]
        }}
        Return ONLY valid JSON. No markdown.
        """

        response = model.generate_content(prompt)
        cleaned_json = clean_json_string(response.text)
        return json.loads(cleaned_json)

    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/evaluate_quiz", response_model=EvaluationResponse)
async def evaluate_quiz(request: EvaluateRequest):
    """
    Analyzes quiz answers and returns top 3 career suggestions.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing.")

    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')

        interaction_history = ""
        for i, resp in enumerate(request.responses):
            interaction_history += f"Q{i+1}: {resp.question_text}\nUser Selected: {resp.selected_option}\n\n"

        subjects_str = ", ".join(request.profile.subjects)
        hobbies_str = ", ".join(request.profile.hobbies)

        prompt = f"""
        Act as an Expert Career Counselor in the Indian Education Context.
        
        Analyze the following student profile and their quiz performance.
        
        PROFILE:
        - Grade: {request.profile.grade_level}
        - Subjects Liked: {subjects_str}
        - Hobbies: {hobbies_str}
        
        QUIZ RESPONSES:
        {interaction_history}
        
        TASK:
        1. Analyze their aptitude based on the technical questions.
        2. Analyze their temperament based on personality questions.
        3. Recommend exactly 3 specific Career Paths or Streams available in India (e.g., Science PCM, Commerce with Math, Diploma in CS).
        4. Assign a "Confidence Score" (0-100%) to each.
        
        Output STRICT JSON format:
        {{
          "summary": "A short 2-sentence analysis.",
          "suggestions": [
            {{
              "role": "e.g. Science (PCM)",
              "confidence": 85,
              "reason": "You showed strong logic in the math questions...",
              "required_skills": ["Logic", "Maths", "Physics"]
            }},
            ... (2 more)
          ]
        }}
        Return ONLY valid JSON. No markdown.
        """

        response = model.generate_content(prompt)
        cleaned_json = clean_json_string(response.text)
        return json.loads(cleaned_json)

    except Exception as e:
        print(f"Error evaluating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def clean_json_string(json_str):
    if json_str.startswith("```json"):
        json_str = json_str[7:]
    if json_str.startswith("```"):
        json_str = json_str[3:]
    if json_str.endswith("```"):
        json_str = json_str[:-3]
    return json_str.strip()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)