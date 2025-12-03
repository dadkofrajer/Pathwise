# Recommendation Letter Manager - Implementation Plan

## Overview
A system to track, manage, and coordinate recommendation letters from teachers, counselors, and other recommenders. This ensures students never miss a recommendation deadline and can follow up appropriately.

## Goals
- Track all recommenders and their relationship to the student
- Monitor request status and deadlines
- Automate reminder system for follow-ups
- Store contact information securely
- Provide templates for request emails

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class RecommenderType(str, Enum):
    TEACHER = "teacher"
    COUNSELOR = "counselor"
    EMPLOYER = "employer"
    COACH = "coach"
    MENTOR = "mentor"
    OTHER = "other"

class RecommendationStatus(str, Enum):
    NOT_REQUESTED = "not_requested"
    REQUESTED = "requested"
    REMINDER_SENT = "reminder_sent"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    COMPLETED = "completed"
    DECLINED = "declined"

class Recommender(BaseModel):
    id: str
    student_id: str
    name: str
    email: str
    phone: Optional[str] = None
    title: str  # e.g., "AP Physics Teacher", "School Counselor"
    type: RecommenderType
    relationship: str  # e.g., "Had for 2 years, led robotics club"
    notes: Optional[str] = None
    created_at: str
    updated_at: str

class RecommendationRequest(BaseModel):
    id: str
    recommender_id: str
    application_id: str  # Links to CollegeApplication
    school_name: str
    deadline: str  # ISO date
    status: RecommendationStatus
    requested_date: Optional[str] = None
    reminder_sent_date: Optional[str] = None
    submitted_date: Optional[str] = None
    platform: Optional[str] = None  # "Common App", "Coalition", "School Portal"
    notes: Optional[str] = None
    created_at: str
    updated_at: str
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/recommenders", response_model=Recommender)
async def create_recommender(recommender: CreateRecommenderRequest):
    """Add a new recommender"""
    pass

@router.get("/recommenders/{student_id}", response_model=list[Recommender])
async def get_recommenders(student_id: str):
    """Get all recommenders for a student"""
    pass

@router.patch("/recommenders/{recommender_id}", response_model=Recommender)
async def update_recommender(recommender_id: str, updates: UpdateRecommenderRequest):
    """Update recommender information"""
    pass

@router.delete("/recommenders/{recommender_id}")
async def delete_recommender(recommender_id: str):
    """Remove a recommender"""
    pass

@router.post("/recommendations/request", response_model=RecommendationRequest)
async def request_recommendation(request: CreateRecommendationRequest):
    """Request a recommendation letter"""
    pass

@router.get("/recommendations/{student_id}", response_model=list[RecommendationRequest])
async def get_recommendations(student_id: str):
    """Get all recommendation requests"""
    pass

@router.patch("/recommendations/{request_id}/status")
async def update_recommendation_status(request_id: str, status: RecommendationStatus):
    """Update recommendation request status"""
    pass

@router.post("/recommendations/{request_id}/reminder")
async def send_reminder(request_id: str):
    """Send reminder email to recommender"""
    pass

@router.get("/recommendations/{student_id}/pending")
async def get_pending_recommendations(student_id: str, days: int = 14):
    """Get recommendations with deadlines in next N days"""
    pass
```

#### Service Layer
```python
# backend/src/portfolio/service.py

def generate_request_email_template(
    recommender: Recommender,
    application: CollegeApplication,
    student_name: str
) -> str:
    """Generate personalized recommendation request email"""
    template = f"""
Subject: Recommendation Request for {student_name} - {application.school_name}

Dear {recommender.title} {recommender.name},

I hope this message finds you well. I am writing to respectfully request a letter of recommendation for my college application to {application.school_name}.

{recommender.relationship}

The deadline for this recommendation is {application.deadline}. I would be grateful if you could submit it through {application.platform or 'the application portal'}.

Thank you for your time and consideration.

Best regards,
{student_name}
"""
    return template

def check_recommendation_urgency(deadline: str, status: RecommendationStatus) -> tuple[bool, int]:
    """Check if reminder is needed"""
    deadline_date = datetime.fromisoformat(deadline)
    days_until = (deadline_date - datetime.now()).days
    
    needs_reminder = (
        status in [RecommendationStatus.REQUESTED, RecommendationStatus.REMINDER_SENT]
        and 0 <= days_until <= 14
    )
    
    return needs_reminder, days_until
```

### Frontend Changes

#### New Components
```
dashboard/components/recommendations/
├── RecommendationManager.tsx       # Main component
├── RecommenderCard.tsx              # Individual recommender card
├── RecommendationRequestCard.tsx   # Request status card
├── AddRecommenderModal.tsx          # Add new recommender
├── RequestRecommendationModal.tsx   # Request letter modal
├── RecommendationStatusBadge.tsx   # Status indicator
├── EmailTemplatePreview.tsx        # Email template viewer
└── ReminderButton.tsx               # Send reminder button
```

#### TypeScript Types
```typescript
// dashboard/lib/recommendations/types.ts

export type RecommenderType = 
  | "teacher" 
  | "counselor" 
  | "employer" 
  | "coach" 
  | "mentor" 
  | "other";

export type RecommendationStatus = 
  | "not_requested" 
  | "requested" 
  | "reminder_sent" 
  | "in_progress" 
  | "submitted" 
  | "completed" 
  | "declined";

export interface Recommender {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  type: RecommenderType;
  relationship: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationRequest {
  id: string;
  recommenderId: string;
  applicationId: string;
  schoolName: string;
  deadline: string;
  status: RecommendationStatus;
  requestedDate?: string;
  reminderSentDate?: string;
  submittedDate?: string;
  platform?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Service Layer
```typescript
// dashboard/lib/recommendations/recommendationService.ts

export async function createRecommender(
  recommender: Omit<Recommender, "id" | "createdAt" | "updatedAt">
): Promise<Recommender> {
  const response = await fetch("/api/recommenders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recommender),
  });
  return response.json();
}

export async function requestRecommendation(
  request: Omit<RecommendationRequest, "id" | "createdAt" | "updatedAt">
): Promise<RecommendationRequest> {
  const response = await fetch("/api/recommendations/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return response.json();
}

export async function sendReminder(requestId: string): Promise<void> {
  await fetch(`/api/recommendations/${requestId}/reminder`, {
    method: "POST",
  });
}

export async function getEmailTemplate(
  recommenderId: string,
  applicationId: string
): Promise<string> {
  const response = await fetch(
    `/api/recommendations/template?recommenderId=${recommenderId}&applicationId=${applicationId}`
  );
  const data = await response.json();
  return data.template;
}
```

#### New Page/Integration
```typescript
// Option 1: Standalone page
// dashboard/app/recommendations/page.tsx

// Option 2: Integrated into applications page
// Add recommendation section to ApplicationDetailsModal
```

### Implementation Steps

1. **Phase 1: Backend Foundation (Week 1)**
   - Add database models for recommenders and requests
   - Create migration scripts
   - Implement CRUD API endpoints
   - Build email template generator
   - Add reminder logic

2. **Phase 2: Frontend Core (Week 2)**
   - Create TypeScript types
   - Build RecommendationManager component
   - Create RecommenderCard component
   - Implement recommender list view
   - Add "Add Recommender" functionality

3. **Phase 3: Request Management (Week 3)**
   - Build RequestRecommendationModal
   - Implement request creation flow
   - Add status tracking
   - Create status badges and indicators
   - Build request list view

4. **Phase 4: Email & Reminders (Week 4)**
   - Build EmailTemplatePreview component
   - Implement email template customization
   - Add reminder sending functionality
   - Create reminder scheduling
   - Add email copy-to-clipboard

5. **Phase 5: Integration & Polish (Week 5)**
   - Integrate with ApplicationTracker
   - Add deadline warnings
   - Connect with application components
   - Add filtering and search
   - Implement bulk operations

### Dependencies

**Backend:**
- `python-email` or `sendgrid` for email sending (optional, can use templates only)
- No other new dependencies

**Frontend:**
- No new dependencies required

### Testing Considerations

**Backend Tests:**
- Test email template generation
- Test reminder logic (when to send reminders)
- Test status transitions
- Test deadline calculations

**Frontend Tests:**
- Test recommender creation
- Test recommendation request flow
- Test email template preview
- Test reminder sending
- Test status updates

### UI/UX Considerations

- Color-code status (green=completed, yellow=pending, red=overdue)
- Show deadline countdown prominently
- Display recommender relationship clearly
- Provide quick actions (send reminder, update status)
- Show which applications need each recommendation
- Add tooltips explaining each status
- Make email template easily copyable
- Show last reminder sent date

### Email Template Features

- Personalization tokens: {student_name}, {school_name}, {deadline}, {relationship}
- Multiple template options (formal, casual, follow-up)
- Preview before sending
- Copy to clipboard functionality
- Track if email was sent through system (optional)

### Future Enhancements

- Actual email sending integration (SendGrid, AWS SES)
- SMS reminders
- Recommender portal (for recommenders to track their requests)
- Bulk request functionality
- Recommendation letter storage (if recommenders share copies)
- Analytics on recommendation completion rates
- Integration with Common App recommendation system

