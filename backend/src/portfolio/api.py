from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from typing import Optional
from .models import (
    PortfolioAnalyzeRequest, PortfolioAnalyzeResponse,
    TestPlanRequest, TestPlanResponse,
    EligibilityCheckRequest, EligibilityCheckResponse,
    RegenerateTasksRequest, RegenerateTasksResponse,
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
