# Test Prep Integration - Implementation Plan

## Overview
Comprehensive test preparation tools including schedule generation, practice test tracking, score improvement analysis, and test date recommendations.

## Goals
- Generate personalized test prep schedules
- Track practice test scores
- Identify weak areas
- Recommend optimal test dates
- Project score improvements

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class PracticeTest(BaseModel):
    id: str
    student_id: str
    test_type: Literal["SAT", "ACT"]
    test_date: str
    score: int
    section_scores: dict[str, int] = Field(default_factory=dict)
    weak_areas: list[str] = Field(default_factory=list)
    notes: Optional[str] = None
    created_at: str

class TestPrepSchedule(BaseModel):
    id: str
    student_id: str
    test_type: Literal["SAT", "ACT"]
    target_date: str
    weekly_hours: int
    schedule: list[dict]  # Daily/weekly study plan
    created_at: str
```

#### Service Layer
```python
# backend/src/portfolio/test_prep_service.py

class TestPrepService:
    def generate_schedule(
        self,
        student_id: str,
        test_type: str,
        target_date: str,
        weekly_hours: int,
        current_score: Optional[int] = None,
        target_score: Optional[int] = None
    ) -> TestPrepSchedule:
        """Generate personalized test prep schedule"""
        # Calculate days until test
        # Allocate study hours
        # Create daily/weekly plan
        pass
    
    def analyze_weak_areas(
        self,
        practice_tests: list[PracticeTest]
    ) -> dict[str, float]:
        """Identify consistently weak areas"""
        # Analyze section scores across tests
        # Calculate improvement needed
        pass
    
    def recommend_test_date(
        self,
        student_id: str,
        application_deadlines: list[str],
        current_score: Optional[int] = None
    ) -> str:
        """Recommend optimal test date"""
        # Consider deadlines
        # Allow time for prep
        # Consider retake opportunities
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/test-prep/schedule", response_model=TestPrepSchedule)
async def generate_test_prep_schedule(request: TestPrepScheduleRequest):
    """Generate test prep schedule"""
    pass

@router.post("/test-prep/practice-test", response_model=PracticeTest)
async def add_practice_test(test: CreatePracticeTestRequest):
    """Add practice test result"""
    pass

@router.get("/test-prep/weak-areas/{student_id}")
async def get_weak_areas(student_id: str, test_type: str):
    """Get identified weak areas"""
    pass

@router.post("/test-prep/recommend-date")
async def recommend_test_date(request: TestDateRecommendationRequest):
    """Recommend test date"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/test-prep/
├── TestPrepDashboard.tsx            # Main dashboard
├── TestPrepSchedule.tsx            # Schedule display
├── PracticeTestTracker.tsx         # Practice test tracking
├── WeakAreasAnalysis.tsx           # Weak areas visualization
├── ScoreProgressChart.tsx          # Score improvement chart
└── TestDateRecommender.tsx         # Test date suggestions
```

### Implementation Steps

1. **Phase 1: Schedule Generator (Week 1)**
   - Build schedule generation logic
   - Create schedule display
   - Add schedule customization

2. **Phase 2: Practice Test Tracking (Week 2)**
   - Build practice test entry
   - Create score tracking
   - Add progress visualization

3. **Phase 3: Analysis Tools (Week 3)**
   - Build weak area identification
   - Create improvement recommendations
   - Add test date recommendations

### Dependencies

**Backend:**
- No new dependencies

**Frontend:**
- `recharts` (for score charts)

