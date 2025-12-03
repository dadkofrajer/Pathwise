# Financial Planning & Cost Calculator - Implementation Plan

## Overview
Comprehensive financial planning tools including cost calculators, financial aid estimators, scholarship finders, and net cost analysis to help students make informed financial decisions.

## Goals
- Calculate total cost of attendance for each school
- Estimate financial aid eligibility
- Find and track scholarships
- Compare net costs across schools
- Plan for 4-year total costs

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class CostBreakdown(BaseModel):
    tuition_in_state: float
    tuition_out_of_state: float
    room_board: float
    books_supplies: float
    transportation: float
    personal_expenses: float
    total_in_state: float
    total_out_of_state: float

class FinancialAidEstimate(BaseModel):
    student_id: str
    school_id: str
    efc: float  # Expected Family Contribution
    estimated_need: float
    estimated_grant_aid: float
    estimated_loan_aid: float
    estimated_work_study: float
    net_cost: float
    calculated_at: str

class Scholarship(BaseModel):
    id: str
    name: str
    organization: str
    amount: Optional[float] = None  # Fixed amount or range
    amount_range: Optional[dict[str, float]] = None  # {"min": 1000, "max": 5000}
    eligibility_criteria: list[str] = Field(default_factory=list)
    application_deadline: Optional[str] = None
    application_url: Optional[str] = None
    renewable: bool = False
    tags: list[str] = Field(default_factory=list)
    created_at: str

class ScholarshipApplication(BaseModel):
    id: str
    student_id: str
    scholarship_id: str
    status: Literal["not_started", "in_progress", "submitted", "awarded", "rejected"]
    application_deadline: str
    amount_awarded: Optional[float] = None
    notes: Optional[str] = None
    created_at: str
    updated_at: str
```

#### Financial Service
```python
# backend/src/portfolio/financial_service.py

class FinancialService:
    def calculate_cost_breakdown(self, school_id: str) -> CostBreakdown:
        """Calculate detailed cost breakdown for a school"""
        school = self.get_school_profile(school_id)
        # Calculate based on school data
        pass
    
    def estimate_financial_aid(
        self,
        student_id: str,
        school_id: str,
        family_income: float,
        assets: float,
        family_size: int
    ) -> FinancialAidEstimate:
        """Estimate financial aid using EFC calculation"""
        # Simplified EFC calculation (actual FAFSA is more complex)
        efc = self._calculate_efc(family_income, assets, family_size)
        
        school = self.get_school_profile(school_id)
        cost_of_attendance = school.tuition_out_of_state or school.tuition_in_state or 0
        cost_of_attendance += school.room_board or 0
        
        estimated_need = max(0, cost_of_attendance - efc)
        
        # Estimate aid (simplified)
        estimated_grant_aid = min(estimated_need * 0.6, cost_of_attendance * 0.5)
        estimated_loan_aid = estimated_need * 0.3
        estimated_work_study = estimated_need * 0.1
        
        net_cost = cost_of_attendance - estimated_grant_aid - estimated_loan_aid - estimated_work_study
        
        return FinancialAidEstimate(...)
    
    def find_scholarships(
        self,
        student_profile: StudentProfile,
        filters: Optional[dict] = None
    ) -> list[Scholarship]:
        """Find matching scholarships"""
        # Match based on eligibility criteria
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.get("/schools/{school_id}/cost-breakdown", response_model=CostBreakdown)
async def get_cost_breakdown(school_id: str):
    """Get detailed cost breakdown"""
    pass

@router.post("/financial-aid/estimate", response_model=FinancialAidEstimate)
async def estimate_financial_aid(request: FinancialAidEstimateRequest):
    """Estimate financial aid"""
    pass

@router.get("/scholarships/search")
async def search_scholarships(
    student_id: str,
    query: Optional[str] = None,
    min_amount: Optional[float] = None
):
    """Search for scholarships"""
    pass

@router.post("/scholarships/{scholarship_id}/apply")
async def apply_scholarship(scholarship_id: str, student_id: str = Body(...)):
    """Track scholarship application"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/financial/
├── CostCalculator.tsx               # Main cost calculator
├── CostBreakdownCard.tsx            # Cost breakdown display
├── FinancialAidEstimator.tsx       # Aid estimation tool
├── ScholarshipFinder.tsx           # Scholarship search
├── ScholarshipCard.tsx              # Individual scholarship
├── NetCostComparison.tsx            # Compare net costs
└── FourYearCostProjection.tsx      # 4-year total calculator
```

### Implementation Steps

1. **Phase 1: Cost Calculator (Week 1)**
   - Build cost breakdown calculation
   - Create cost display components
   - Add school cost data integration

2. **Phase 2: Financial Aid Estimator (Week 2)**
   - Implement EFC calculation (simplified)
   - Build aid estimation logic
   - Create estimator UI

3. **Phase 3: Scholarship Finder (Week 3)**
   - Build scholarship database
   - Implement matching algorithm
   - Create search and filter UI

4. **Phase 4: Comparison Tools (Week 4)**
   - Build net cost comparison
   - Create 4-year projection
   - Add visualization

### Dependencies

**Backend:**
- No new dependencies

**Frontend:**
- `recharts` (for cost visualizations)

