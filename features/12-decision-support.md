# Decision Support Tools - Implementation Plan

## Overview
Tools to help students compare acceptances, make informed decisions using weighted decision matrices, and track waitlist strategies.

## Goals
- Compare acceptances side-by-side
- Create weighted decision matrices
- Track waitlist status and strategies
- Provide decision recommendations
- Support letter of continued interest

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class DecisionMatrix(BaseModel):
    id: str
    student_id: str
    schools: list[str]  # School IDs
    factors: list[dict]  # {"name": "Cost", "weight": 0.3}
    scores: dict[str, dict[str, float]]  # school_id -> factor -> score
    total_scores: dict[str, float]  # school_id -> total
    created_at: str
    updated_at: str

class WaitlistStrategy(BaseModel):
    id: str
    student_id: str
    school_id: str
    application_id: str
    waitlist_date: str
    status: Literal["waitlisted", "accepted_from_waitlist", "rejected_from_waitlist"]
    letter_sent: bool = False
    letter_sent_date: Optional[str] = None
    updates_submitted: bool = False
    updates_submitted_date: Optional[str] = None
    notes: Optional[str] = None
    created_at: str
```

#### Service Layer
```python
# backend/src/portfolio/decision_service.py

class DecisionService:
    def create_decision_matrix(
        self,
        student_id: str,
        school_ids: list[str],
        factors: list[dict]
    ) -> DecisionMatrix:
        """Create decision matrix"""
        pass
    
    def calculate_total_scores(
        self,
        matrix: DecisionMatrix
    ) -> dict[str, float]:
        """Calculate weighted total scores"""
        # For each school: sum(factor_score * factor_weight)
        pass
    
    def generate_waitlist_letter_template(
        self,
        school_id: str,
        student_id: str
    ) -> str:
        """Generate letter of continued interest template"""
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/decisions/matrix", response_model=DecisionMatrix)
async def create_decision_matrix(request: CreateDecisionMatrixRequest):
    """Create decision matrix"""
    pass

@router.get("/decisions/matrix/{matrix_id}", response_model=DecisionMatrix)
async def get_decision_matrix(matrix_id: str):
    """Get decision matrix"""
    pass

@router.post("/waitlist/strategy", response_model=WaitlistStrategy)
async def create_waitlist_strategy(request: CreateWaitlistStrategyRequest):
    """Create waitlist strategy"""
    pass

@router.get("/waitlist/strategies/{student_id}")
async def get_waitlist_strategies(student_id: str):
    """Get all waitlist strategies"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/decisions/
├── DecisionMatrix.tsx               # Decision matrix builder
├── SchoolComparison.tsx            # Side-by-side comparison
├── WaitlistTracker.tsx             # Waitlist management
├── LetterOfContinuedInterest.tsx   # LOCI templates
└── DecisionRecommendation.tsx     # AI recommendations
```

### Implementation Steps

1. **Phase 1: Decision Matrix (Week 1)**
   - Build matrix creation UI
   - Implement weighted scoring
   - Create comparison view

2. **Phase 2: Waitlist Tools (Week 2)**
   - Build waitlist tracking
   - Create LOCI templates
   - Add update tracking

3. **Phase 3: Recommendations (Week 3)**
   - Build AI recommendations
   - Create decision support
   - Add pros/cons lists

### Dependencies

**Backend:**
- No new dependencies

**Frontend:**
- No new dependencies

