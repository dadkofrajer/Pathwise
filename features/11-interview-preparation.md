# Interview Preparation - Implementation Plan

## Overview
Comprehensive interview preparation tools including question databases, practice simulators, video recording, and school-specific interview guidance.

## Goals
- Provide common interview questions
- Offer school-specific interview questions
- Enable practice interviews with AI
- Support video recording and review
- Provide interview tips and strategies

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class InterviewQuestion(BaseModel):
    id: str
    question_text: str
    category: Literal["personal", "academic", "why_school", "future_goals", "challenges", "other"]
    school_id: Optional[str] = None  # School-specific questions
    interview_type: Literal["alumni", "admissions_officer", "panel", "virtual"]
    difficulty: Literal["easy", "medium", "hard"]
    tips: Optional[str] = None

class InterviewPractice(BaseModel):
    id: str
    student_id: str
    interview_type: str
    school_id: Optional[str] = None
    questions_asked: list[str]  # Question IDs
    answers: dict[str, str]  # question_id -> answer
    recording_url: Optional[str] = None
    feedback: Optional[dict] = None
    practice_date: str
    created_at: str
```

#### Service Layer
```python
# backend/src/portfolio/interview_service.py

class InterviewService:
    def get_questions(
        self,
        school_id: Optional[str] = None,
        category: Optional[str] = None,
        interview_type: Optional[str] = None
    ) -> list[InterviewQuestion]:
        """Get interview questions"""
        pass
    
    def conduct_practice_interview(
        self,
        student_id: str,
        school_id: Optional[str] = None,
        interview_type: str = "admissions_officer"
    ) -> InterviewPractice:
        """Conduct AI-powered practice interview"""
        # Select questions
        # Use AI to simulate interviewer
        # Provide feedback
        pass
    
    def analyze_answer(
        self,
        question: InterviewQuestion,
        answer: str
    ) -> dict:
        """Analyze answer quality"""
        # Use AI to evaluate answer
        # Provide feedback
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.get("/interviews/questions")
async def get_interview_questions(
    school_id: Optional[str] = None,
    category: Optional[str] = None
):
    """Get interview questions"""
    pass

@router.post("/interviews/practice", response_model=InterviewPractice)
async def start_practice_interview(request: PracticeInterviewRequest):
    """Start practice interview"""
    pass

@router.post("/interviews/analyze-answer")
async def analyze_answer(request: AnswerAnalysisRequest):
    """Analyze interview answer"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/interviews/
├── InterviewPrepDashboard.tsx       # Main dashboard
├── QuestionBank.tsx                # Question database
├── PracticeInterview.tsx           # Practice simulator
├── AnswerRecorder.tsx               # Video/audio recording
├── InterviewFeedback.tsx           # Feedback display
└── InterviewTips.tsx               # Tips and strategies
```

### Implementation Steps

1. **Phase 1: Question Database (Week 1)**
   - Build question database
   - Create question filtering
   - Add school-specific questions

2. **Phase 2: Practice Simulator (Week 2)**
   - Build AI interview simulator
   - Create practice flow
   - Add answer recording

3. **Phase 3: Feedback System (Week 3)**
   - Build answer analysis
   - Create feedback display
   - Add improvement suggestions

### Dependencies

**Backend:**
- `openai` (for AI interview simulation)

**Frontend:**
- `react-media-recorder` (for video recording)
- No other new dependencies

