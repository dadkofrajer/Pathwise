from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from .models import (
    PortfolioAnalyzeRequest, PortfolioAnalyzeResponse,
    TestPlanRequest, TestPlanResponse,
    EligibilityCheckRequest, EligibilityCheckResponse,
    RegenerateTasksRequest, RegenerateTasksResponse,
    Evidence, StudentProfile,
    EssayAnalysis, AnalyzeEssayRequest
)
from .service import analyze_portfolio, plan_tests, check_eligibility, regenerate_tasks_for_section
from .essay_analyzer import EssayAnalyzer

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.post("/analyze", response_model=PortfolioAnalyzeResponse)
def analyze(req: PortfolioAnalyzeRequest):
    try:
        result = analyze_portfolio(req)
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analyzer error: {e}")

test_router = APIRouter(prefix="/tests", tags=["tests"])

@test_router.post("/plan", response_model=TestPlanResponse)
def plan_test(req: TestPlanRequest):
    try:
        result = plan_tests(req)
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test planning error: {e}")

eligibility_router = APIRouter(prefix="/eligibility", tags=["eligibility"])

@eligibility_router.post("/check", response_model=EligibilityCheckResponse)
def check(req: EligibilityCheckRequest):
    try:
        result = check_eligibility(req)
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility check error: {e}")

@router.post("/regenerate-tasks", response_model=RegenerateTasksResponse)
def regenerate_tasks(req: RegenerateTasksRequest):
    """Regenerate alternative tasks for a specific section"""
    try:
        result = regenerate_tasks_for_section(
            req.original_request,
            req.section_type,
            req.section_identifier,
            req.exclude_task_titles
        )
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Task regeneration error: {e}")

# Portfolio CRUD endpoints
profile_router = APIRouter(prefix="/profile", tags=["profile"])

# In-memory storage (replace with database in production)
_portfolio_storage: dict[str, List[Evidence]] = {}
_profile_storage: dict[str, StudentProfile] = {}

@profile_router.get("/{student_id}")
def get_profile(student_id: str):
    """Get student profile and portfolio activities"""
    profile = _profile_storage.get(student_id)
    activities = _portfolio_storage.get(student_id, [])
    
    return {
        "profile": jsonable_encoder(profile) if profile else None,
        "activities": [jsonable_encoder(activity) for activity in activities]
    }

@profile_router.post("/{student_id}")
def create_or_update_profile(student_id: str, profile: StudentProfile):
    """Create or update student profile"""
    _profile_storage[student_id] = profile
    return {"message": "Profile updated", "profile": jsonable_encoder(profile)}

@profile_router.post("/{student_id}/activities", response_model=Evidence)
def add_activity(student_id: str, activity: Evidence):
    """Add a new activity to student's portfolio"""
    if student_id not in _portfolio_storage:
        _portfolio_storage[student_id] = []
    _portfolio_storage[student_id].append(activity)
    return jsonable_encoder(activity)

@profile_router.get("/{student_id}/activities", response_model=List[Evidence])
def get_activities(student_id: str):
    """Get all activities for a student"""
    activities = _portfolio_storage.get(student_id, [])
    return [jsonable_encoder(activity) for activity in activities]

@profile_router.put("/{student_id}/activities/{activity_id}", response_model=Evidence)
def update_activity(student_id: str, activity_id: str, activity: Evidence):
    """Update an existing activity"""
    if student_id not in _portfolio_storage:
        raise HTTPException(status_code=404, detail="Student portfolio not found")
    
    activities = _portfolio_storage[student_id]
    index = next((i for i, a in enumerate(activities) if a.id == activity_id), None)
    
    if index is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    activities[index] = activity
    return jsonable_encoder(activity)

@profile_router.delete("/{student_id}/activities/{activity_id}")
def delete_activity(student_id: str, activity_id: str):
    """Delete an activity from portfolio"""
    if student_id not in _portfolio_storage:
        raise HTTPException(status_code=404, detail="Student portfolio not found")
    
    activities = _portfolio_storage[student_id]
    initial_length = len(activities)
    _portfolio_storage[student_id] = [a for a in activities if a.id != activity_id]
    
    if len(_portfolio_storage[student_id]) == initial_length:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return {"message": "Activity deleted"}

# Essay Analysis Routes
essay_router = APIRouter(prefix="/essays", tags=["essays"])

@essay_router.post("/analyze-text", response_model=EssayAnalysis)
def analyze_essay_text(request: AnalyzeEssayRequest):
    """Analyze essay text directly (for draft analysis)"""
    try:
        analyzer = EssayAnalyzer()
        result = analyzer.analyze_essay(
            essay_text=request.essay_text,
            essay_id=request.essay_id,
            prompt=request.prompt_text,
            target_word_count=request.target_word_count
        )
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Essay analysis error: {e}")

@essay_router.post("/{essay_id}/analyze", response_model=EssayAnalysis)
def analyze_essay(
    essay_id: str,
    request: AnalyzeEssayRequest
):
    """Analyze an essay by ID and return feedback"""
    try:
        analyzer = EssayAnalyzer()
        result = analyzer.analyze_essay(
            essay_text=request.essay_text,
            essay_id=essay_id,
            prompt=request.prompt_text,
            target_word_count=request.target_word_count
        )
        return jsonable_encoder(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Essay analysis error: {e}")
