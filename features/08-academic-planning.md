# Academic Planning - Implementation Plan

## Overview
Tools for tracking high school courses, grades, GPA calculations, and course recommendations to strengthen college applications.

## Goals
- Track all high school courses and grades
- Calculate and project GPA
- Recommend courses to strengthen application
- Plan course schedules
- Analyze course difficulty

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class Course(BaseModel):
    id: str
    student_id: str
    course_name: str
    subject: str  # Math, Science, English, etc.
    level: Literal["regular", "honors", "ap", "ib", "dual_enrollment"]
    grade: str  # A, B, C, etc. or numeric
    credits: float
    year: str  # "9th", "10th", "11th", "12th"
    semester: Optional[Literal["fall", "spring", "full_year"]] = None
    gpa_points: float  # Calculated based on level and grade
    created_at: str

class CourseRecommendation(BaseModel):
    student_id: str
    recommended_courses: list[dict]  # Course suggestions
    reasoning: str
    priority: Literal["high", "medium", "low"]
```

#### Service Layer
```python
# backend/src/portfolio/academic_service.py

class AcademicService:
    def calculate_gpa(
        self,
        courses: list[Course],
        weighted: bool = True
    ) -> float:
        """Calculate GPA from courses"""
        if weighted:
            total_points = sum(c.gpa_points * c.credits for c in courses)
            total_credits = sum(c.credits for c in courses)
        else:
            # Unweighted: A=4.0, B=3.0, etc.
            total_points = sum(self._grade_to_points(c.grade) * c.credits for c in courses)
            total_credits = sum(c.credits for c in courses)
        
        return total_points / total_credits if total_credits > 0 else 0.0
    
    def recommend_courses(
        self,
        student_id: str,
        intended_major: Optional[str] = None
    ) -> CourseRecommendation:
        """Recommend courses to strengthen application"""
        # Analyze current courses
        # Identify gaps
        # Recommend based on major and portfolio gaps
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/courses", response_model=Course)
async def add_course(course: CreateCourseRequest):
    """Add a course"""
    pass

@router.get("/courses/{student_id}", response_model=list[Course])
async def get_courses(student_id: str):
    """Get all courses"""
    pass

@router.get("/academic/gpa/{student_id}")
async def calculate_gpa(student_id: str, weighted: bool = True):
    """Calculate GPA"""
    pass

@router.get("/academic/recommendations/{student_id}")
async def get_course_recommendations(student_id: str):
    """Get course recommendations"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/academic/
├── CourseTracker.tsx                # Main course tracking
├── CourseCard.tsx                   # Individual course
├── GPACalculator.tsx                # GPA calculator
├── CourseRecommendations.tsx       # Course suggestions
└── TranscriptView.tsx              # Transcript display
```

### Implementation Steps

1. **Phase 1: Course Tracking (Week 1)**
   - Build course data models
   - Create course CRUD operations
   - Build course entry UI

2. **Phase 2: GPA Calculator (Week 2)**
   - Implement GPA calculation logic
   - Build GPA display
   - Add weighted/unweighted toggle

3. **Phase 3: Recommendations (Week 3)**
   - Build recommendation engine
   - Create recommendation UI
   - Integrate with portfolio analysis

### Dependencies

**Backend:**
- No new dependencies

**Frontend:**
- No new dependencies

