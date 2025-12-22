# School Research & Comparison - Implementation Plan

## Overview
A comprehensive school database with detailed profiles, side-by-side comparison tools, fit scoring, and application strategy recommendations. Helps students make informed decisions about where to apply.

## Goals
- Provide detailed school information and statistics
- Enable easy comparison between schools
- Calculate fit scores based on student profile
- Recommend application strategy (reach/match/safety)
- Track school research progress

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class SchoolProfile(BaseModel):
    id: str
    name: str
    common_name: Optional[str] = None  # e.g., "MIT" for "Massachusetts Institute of Technology"
    location: str
    state: Optional[str] = None
    country: str
    school_type: Literal["public", "private", "ivy_league", "liberal_arts"]
    acceptance_rate: Optional[float] = Field(None, ge=0.0, le=1.0)
    total_enrollment: Optional[int] = None
    undergraduate_enrollment: Optional[int] = None
    tuition_in_state: Optional[float] = None
    tuition_out_of_state: Optional[float] = None
    room_board: Optional[float] = None
    test_scores_mid50: dict[str, list[int]] = Field(default_factory=dict)  # {"SAT": [1300, 1500], "ACT": [30, 34]}
    gpa_mid50: Optional[dict[str, float]] = None  # {"unweighted": 3.7, "weighted": 4.2}
    popular_majors: list[str] = Field(default_factory=list)
    application_platform: Optional[Platform] = None
    application_fee: Optional[float] = None
    early_deadline: Optional[str] = None
    regular_deadline: Optional[str] = None
    website: Optional[str] = None
    virtual_tour_url: Optional[str] = None
    factors_importance: Optional[dict[str, str]] = None  # From SchoolContext
    notes: Optional[str] = None
    created_at: str
    updated_at: str

class SchoolComparison(BaseModel):
    school_ids: list[str]
    comparison_fields: list[str]  # Which fields to compare
    student_profile_id: Optional[str] = None  # For fit scores

class FitScore(BaseModel):
    school_id: str
    student_id: str
    overall_score: float = Field(ge=0.0, le=100.0)
    academic_fit: float = Field(ge=0.0, le=100.0)
    financial_fit: float = Field(ge=0.0, le=100.0)
    cultural_fit: float = Field(ge=0.0, le=100.0)
    location_fit: float = Field(ge=0.0, le=100.0)
    factors: dict[str, float] = Field(default_factory=dict)
    explanation: str
    calculated_at: str

class ApplicationStrategy(BaseModel):
    student_id: str
    reach_schools: list[str] = Field(default_factory=list)
    match_schools: list[str] = Field(default_factory=list)
    safety_schools: list[str] = Field(default_factory=list)
    reasoning: dict[str, str] = Field(default_factory=dict)  # school_id -> reasoning
    calculated_at: str
```

#### School Data Service
```python
# backend/src/portfolio/school_service.py

class SchoolService:
    def __init__(self):
        # Load school data from database or external API
        pass
    
    def get_school_profile(self, school_id: str) -> SchoolProfile:
        """Get detailed school profile"""
        pass
    
    def search_schools(
        self,
        query: Optional[str] = None,
        location: Optional[str] = None,
        school_type: Optional[str] = None,
        min_acceptance_rate: Optional[float] = None,
        max_acceptance_rate: Optional[float] = None
    ) -> list[SchoolProfile]:
        """Search schools by criteria"""
        pass
    
    def compare_schools(
        self,
        school_ids: list[str],
        fields: Optional[list[str]] = None
    ) -> SchoolComparison:
        """Compare multiple schools"""
        pass
    
    def calculate_fit_score(
        self,
        school_id: str,
        student_profile: StudentProfile
    ) -> FitScore:
        """Calculate how well a school fits a student"""
        
        school = self.get_school_profile(school_id)
        
        # Academic fit (0-40 points)
        academic_fit = self._calculate_academic_fit(school, student_profile)
        
        # Financial fit (0-20 points)
        financial_fit = self._calculate_financial_fit(school, student_profile)
        
        # Cultural fit (0-20 points) - based on school type, size, etc.
        cultural_fit = self._calculate_cultural_fit(school, student_profile)
        
        # Location fit (0-20 points)
        location_fit = self._calculate_location_fit(school, student_profile)
        
        overall = academic_fit + financial_fit + cultural_fit + location_fit
        
        return FitScore(
            school_id=school_id,
            student_id=student_profile.student_id,
            overall_score=overall,
            academic_fit=academic_fit,
            financial_fit=financial_fit,
            cultural_fit=cultural_fit,
            location_fit=location_fit,
            explanation=self._generate_fit_explanation(...),
            calculated_at=datetime.now().isoformat()
        )
    
    def _calculate_academic_fit(
        self,
        school: SchoolProfile,
        student: StudentProfile
    ) -> float:
        """Calculate academic fit score (0-40)"""
        score = 0.0
        
        # GPA fit (0-15 points)
        if student.gpa_unweighted and school.gpa_mid50:
            target_gpa = school.gpa_mid50.get("unweighted", 3.5)
            if student.gpa_unweighted >= target_gpa:
                score += 15
            elif student.gpa_unweighted >= target_gpa - 0.3:
                score += 10
            elif student.gpa_unweighted >= target_gpa - 0.5:
                score += 5
        
        # Test score fit (0-15 points)
        if student.tests.sat and school.test_scores_mid50.get("SAT"):
            sat_range = school.test_scores_mid50["SAT"]
            student_sat = student.tests.sat.score
            if sat_range[0] <= student_sat <= sat_range[2]:
                score += 15
            elif student_sat >= sat_range[2]:
                score += 12
            elif student_sat >= sat_range[0] - 100:
                score += 8
        
        # Major fit (0-10 points)
        if student.intended_major and school.popular_majors:
            if student.intended_major in school.popular_majors:
                score += 10
            elif any(major.lower() in student.intended_major.lower() 
                    for major in school.popular_majors):
                score += 5
        
        return min(score, 40.0)
    
    def recommend_application_strategy(
        self,
        student_id: str,
        school_ids: list[str]
    ) -> ApplicationStrategy:
        """Categorize schools as reach/match/safety"""
        student = self.get_student_profile(student_id)
        strategy = ApplicationStrategy(student_id=student_id)
        
        for school_id in school_ids:
            fit_score = self.calculate_fit_score(school_id, student)
            school = self.get_school_profile(school_id)
            
            # Categorize based on fit score and acceptance rate
            if fit_score.overall_score >= 70 and (
                not school.acceptance_rate or school.acceptance_rate >= 0.3
            ):
                strategy.safety_schools.append(school_id)
                strategy.reasoning[school_id] = "High fit score and reasonable acceptance rate"
            elif fit_score.overall_score >= 50 and (
                not school.acceptance_rate or school.acceptance_rate >= 0.15
            ):
                strategy.match_schools.append(school_id)
                strategy.reasoning[school_id] = "Good fit with competitive acceptance rate"
            else:
                strategy.reach_schools.append(school_id)
                strategy.reasoning[school_id] = "Lower fit score or highly competitive"
        
        strategy.calculated_at = datetime.now().isoformat()
        return strategy
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.get("/schools/search")
async def search_schools(
    query: Optional[str] = None,
    location: Optional[str] = None,
    school_type: Optional[str] = None,
    limit: int = 50
):
    """Search for schools"""
    pass

@router.get("/schools/{school_id}", response_model=SchoolProfile)
async def get_school_profile(school_id: str):
    """Get detailed school profile"""
    pass

@router.post("/schools/compare", response_model=SchoolComparison)
async def compare_schools(
    school_ids: list[str] = Body(...),
    fields: Optional[list[str]] = Body(None)
):
    """Compare multiple schools"""
    pass

@router.post("/schools/{school_id}/fit-score", response_model=FitScore)
async def calculate_fit_score(
    school_id: str,
    student_id: str = Body(...)
):
    """Calculate fit score for a school"""
    pass

@router.get("/students/{student_id}/fit-scores")
async def get_all_fit_scores(student_id: str):
    """Get fit scores for all schools student is considering"""
    pass

@router.post("/students/{student_id}/application-strategy", response_model=ApplicationStrategy)
async def get_application_strategy(
    student_id: str,
    school_ids: list[str] = Body(...)
):
    """Get application strategy recommendations"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/schools/
├── SchoolDatabase.tsx                # Main school search/browse
├── SchoolProfileCard.tsx             # Individual school card
├── SchoolComparisonTable.tsx        # Side-by-side comparison
├── FitScoreCard.tsx                  # Fit score visualization
├── ApplicationStrategyView.tsx       # Reach/match/safety display
├── SchoolSearchFilters.tsx          # Search filters
├── SchoolDetailsModal.tsx           # Detailed school view
└── FitScoreBreakdown.tsx            # Fit score factors
```

#### TypeScript Types
```typescript
// dashboard/lib/schools/types.ts

export interface SchoolProfile {
  id: string;
  name: string;
  commonName?: string;
  location: string;
  state?: string;
  country: string;
  schoolType: "public" | "private" | "ivy_league" | "liberal_arts";
  acceptanceRate?: number;
  totalEnrollment?: number;
  undergraduateEnrollment?: number;
  tuitionInState?: number;
  tuitionOutOfState?: number;
  roomBoard?: number;
  testScoresMid50: Record<string, number[]>;
  gpaMid50?: {
    unweighted?: number;
    weighted?: number;
  };
  popularMajors: string[];
  applicationPlatform?: string;
  applicationFee?: number;
  earlyDeadline?: string;
  regularDeadline?: string;
  website?: string;
  virtualTourUrl?: string;
  factorsImportance?: Record<string, string>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FitScore {
  schoolId: string;
  studentId: string;
  overallScore: number;
  academicFit: number;
  financialFit: number;
  culturalFit: number;
  locationFit: number;
  factors: Record<string, number>;
  explanation: string;
  calculatedAt: string;
}

export interface ApplicationStrategy {
  studentId: string;
  reachSchools: string[];
  matchSchools: string[];
  safetySchools: string[];
  reasoning: Record<string, string>;
  calculatedAt: string;
}
```

#### Service Layer
```typescript
// dashboard/lib/schools/schoolService.ts

export async function searchSchools(filters: {
  query?: string;
  location?: string;
  schoolType?: string;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
}): Promise<SchoolProfile[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/schools/search?${params}`);
  return response.json();
}

export async function getSchoolProfile(schoolId: string): Promise<SchoolProfile> {
  const response = await fetch(`/api/schools/${schoolId}`);
  return response.json();
}

export async function compareSchools(
  schoolIds: string[],
  fields?: string[]
): Promise<SchoolComparison> {
  const response = await fetch("/api/schools/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ school_ids: schoolIds, fields }),
  });
  return response.json();
}

export async function calculateFitScore(
  schoolId: string,
  studentId: string
): Promise<FitScore> {
  const response = await fetch(`/api/schools/${schoolId}/fit-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId }),
  });
  return response.json();
}

export async function getApplicationStrategy(
  studentId: string,
  schoolIds: string[]
): Promise<ApplicationStrategy> {
  const response = await fetch(`/api/students/${studentId}/application-strategy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ school_ids: schoolIds }),
  });
  return response.json();
}
```

#### New Page
```typescript
// dashboard/app/schools/page.tsx
// Main school research page with:
// - School search and filters
// - School list/grid view
// - Comparison tool
// - Fit score calculator
// - Application strategy view
```

### Implementation Steps

1. **Phase 1: School Database (Week 1)**
   - Design school data schema
   - Import/seed school data (from public APIs or manual entry)
   - Create school search functionality
   - Build basic school profile API
   - Add school data validation

2. **Phase 2: School Profiles (Week 2)**
   - Build school profile display
   - Create school card component
   - Add school details modal
   - Implement school search UI
   - Add filtering functionality

3. **Phase 3: Comparison Tool (Week 3)**
   - Build comparison table component
   - Implement side-by-side view
   - Add field selection
   - Create comparison export
   - Add visual comparison charts

4. **Phase 4: Fit Score Calculator (Week 4)**
   - Implement fit score calculation logic
   - Build fit score visualization
   - Create fit score breakdown
   - Add fit score explanations
   - Integrate with student profile

5. **Phase 5: Application Strategy (Week 5)**
   - Build application strategy calculator
   - Create reach/match/safety visualization
   - Add strategy recommendations
   - Integrate with application tracker
   - Polish UI/UX

### Data Sources

**School Data:**
- College Board API (if available)
- IPEDS (Integrated Postsecondary Education Data System)
- Manual data entry
- Common Data Set (CDS) files
- School websites

**Key Data Points:**
- Basic info (name, location, type)
- Admissions (acceptance rate, test scores, GPA)
- Financial (tuition, fees, aid)
- Academic (majors, programs)
- Application (deadlines, requirements, platform)

### Dependencies

**Backend:**
- `requests` (for external API calls, if needed)
- No other new dependencies

**Frontend:**
- `recharts` or `chart.js` (for comparison charts)
- No other new dependencies

### Testing Considerations

**Backend Tests:**
- Test school search with various filters
- Test fit score calculation accuracy
- Test application strategy categorization
- Test comparison functionality
- Test data validation

**Frontend Tests:**
- Test school search UI
- Test comparison table
- Test fit score display
- Test application strategy view
- Test responsive design

### UI/UX Considerations

- Color-code fit scores (green=high, yellow=medium, red=low)
- Show acceptance rates with visual indicators
- Display test score ranges clearly
- Make comparison table sortable
- Add school logos (if available)
- Show fit score breakdown in expandable sections
- Provide "add to list" functionality
- Add school notes/annotations
- Show virtual tour links prominently

### Future Enhancements

- Integration with college ranking sites
- Student reviews and ratings
- Campus visit planning
- Virtual tour integration
- Financial aid calculator
- Scholarship finder per school
- Alumni network information
- Career outcomes data
- Integration with Naviance (if available)
- School-specific essay prompt database

