from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import typing
import json
import os

router = APIRouter()

class ResumeAnalysisRequest(BaseModel):
    text: str

class ResumeAnalysisResponse(BaseModel):
    analysis_score: int
    skills_detected: typing.List[str]
    missing_important_skills: typing.List[str]
    best_fit_roles: typing.List[str]
    strengths: typing.List[str]
    weaknesses: typing.List[str]
    future_path: typing.List[str]
    summary: str

@router.post("/analyze_resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured.")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = f"""
    Analyze the following resume text and provide a structured assessment.
    
    Resume Text:
    {request.text}
    
    Output strictly valid JSON in the following format:
    {{
      "analysis_score": 0, // 0-100 score based on completeness and quality
      "skills_detected": ["Skill 1", "Skill 2"],
      "missing_important_skills": ["Missing Skill 1"],
      "best_fit_roles": ["Role 1", "Role 2"],
      "strengths": ["Strength 1"],
      "weaknesses": ["Weakness 1"],
      "future_path": ["Step 1", "Step 2"],
      "summary": "Professional summary..."
    }}
    
    Do not include any markdown formatting (like ```json ... ```). Just the raw JSON string.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up response text if it contains markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        analysis_data = json.loads(response_text.strip())
        return analysis_data
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Gemini response as JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
