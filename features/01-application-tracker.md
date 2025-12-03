# Application Tracker - Implementation Plan

## Overview
A comprehensive application management system that tracks the status, progress, and requirements for each college application. This serves as the central hub for managing all application-related tasks.

## Goals
- Provide real-time visibility into application status across all schools
- Ensure no component is missed or forgotten
- Track progress with visual indicators
- Send automated reminders for deadlines and missing components

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# New models in backend/src/portfolio/models.py

class ApplicationStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    WAITLISTED = "waitlisted"
    REJECTED = "rejected"
    DEFERRED = "deferred"

class ApplicationComponent(str, Enum):
    TRANSCRIPT = "transcript"
    TEST_SCORES = "test_scores"
    RECOMMENDATIONS = "recommendations"
    ESSAYS = "essays"
    SUPPLEMENTS = "supplements"
    FEES = "fees"
    PORTFOLIO = "portfolio"
    INTERVIEW = "interview"
    FINANCIAL_AID = "financial_aid"

class ApplicationComponentStatus(BaseModel):
    component: ApplicationComponent
    status: Literal["not_started", "in_progress", "completed", "submitted"]
    notes: Optional[str] = None
    completed_date: Optional[str] = None
    required: bool = True

class CollegeApplication(BaseModel):
    id: str = Field(..., description="Unique application ID")
    student_id: str
    school_name: str
    application_round: Literal["EA", "ED", "RD", "Regular", "Rolling", "Other"]
    deadline: str  # ISO date
    submission_date: Optional[str] = None
    status: ApplicationStatus
    components: list[ApplicationComponentStatus] = Field(default_factory=list)
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0)
    notes: Optional[str] = None
    created_at: str
    updated_at: str
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/applications", response_model=CollegeApplication)
async def create_application(application: CreateApplicationRequest):
    """Create a new college application"""
    pass

@router.get("/applications/{student_id}", response_model=list[CollegeApplication])
async def get_applications(student_id: str):
    """Get all applications for a student"""
    pass

@router.get("/applications/{application_id}", response_model=CollegeApplication)
async def get_application(application_id: str):
    """Get a specific application"""
    pass

@router.patch("/applications/{application_id}", response_model=CollegeApplication)
async def update_application(application_id: str, updates: UpdateApplicationRequest):
    """Update application status or components"""
    pass

@router.patch("/applications/{application_id}/components/{component}")
async def update_component_status(application_id: str, component: ApplicationComponent, status: str):
    """Update status of a specific component"""
    pass

@router.get("/applications/{student_id}/progress")
async def get_overall_progress(student_id: str):
    """Get overall application progress across all schools"""
    pass

@router.get("/applications/{student_id}/upcoming-deadlines")
async def get_upcoming_deadlines(student_id: str, days: int = 30):
    """Get applications with deadlines in the next N days"""
    pass
```

#### Service Layer
```python
# backend/src/portfolio/service.py

def calculate_progress(application: CollegeApplication) -> float:
    """Calculate completion percentage based on component status"""
    if not application.components:
        return 0.0
    completed = sum(1 for c in application.components if c.status == "completed" or c.status == "submitted")
    total = len([c for c in application.components if c.required])
    return (completed / total * 100) if total > 0 else 0.0

def get_missing_components(application: CollegeApplication) -> list[ApplicationComponent]:
    """Identify missing or incomplete required components"""
    return [
        c.component for c in application.components 
        if c.required and c.status in ["not_started", "in_progress"]
    ]

def check_deadline_urgency(deadline: str, days_threshold: int = 7) -> bool:
    """Check if deadline is approaching"""
    deadline_date = datetime.fromisoformat(deadline)
    days_until = (deadline_date - datetime.now()).days
    return 0 <= days_until <= days_threshold
```

### Frontend Changes

#### New Components
```
dashboard/components/applications/
├── ApplicationTracker.tsx          # Main component
├── ApplicationCard.tsx              # Individual application card
├── ApplicationProgressBar.tsx      # Progress visualization
├── ComponentChecklist.tsx          # Component status checklist
├── ApplicationStatusBadge.tsx     # Status indicator
├── CreateApplicationModal.tsx      # Create new application
└── ApplicationDetailsModal.tsx    # Detailed view
```

#### TypeScript Types
```typescript
// dashboard/lib/applications/types.ts

export type ApplicationStatus = 
  | "not_started" 
  | "in_progress" 
  | "submitted" 
  | "accepted" 
  | "waitlisted" 
  | "rejected" 
  | "deferred";

export type ApplicationComponent = 
  | "transcript" 
  | "test_scores" 
  | "recommendations" 
  | "essays" 
  | "supplements" 
  | "fees" 
  | "portfolio" 
  | "interview" 
  | "financial_aid";

export interface ComponentStatus {
  component: ApplicationComponent;
  status: "not_started" | "in_progress" | "completed" | "submitted";
  notes?: string;
  completedDate?: string;
  required: boolean;
}

export interface CollegeApplication {
  id: string;
  studentId: string;
  schoolName: string;
  applicationRound: "EA" | "ED" | "RD" | "Regular" | "Rolling" | "Other";
  deadline: string;
  submissionDate?: string;
  status: ApplicationStatus;
  components: ComponentStatus[];
  progressPercentage: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Service Layer
```typescript
// dashboard/lib/applications/applicationService.ts

export async function createApplication(
  application: Omit<CollegeApplication, "id" | "createdAt" | "updatedAt" | "progressPercentage">
): Promise<CollegeApplication> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  return response.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<CollegeApplication> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
}

export async function updateComponentStatus(
  applicationId: string,
  component: ApplicationComponent,
  status: ComponentStatus["status"]
): Promise<CollegeApplication> {
  const response = await fetch(
    `/api/applications/${applicationId}/components/${component}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
  return response.json();
}
```

#### New Page
```typescript
// dashboard/app/applications/page.tsx
// Main applications tracking page with:
// - Grid/list view of all applications
// - Filter by status, deadline, school
// - Sort by deadline, progress, school name
// - Quick actions (mark complete, add note, etc.)
```

### Implementation Steps

1. **Phase 1: Backend Foundation (Week 1)**
   - Add database models for applications and components
   - Create migration scripts
   - Implement basic CRUD API endpoints
   - Add progress calculation logic
   - Write unit tests for service functions

2. **Phase 2: Frontend Core (Week 2)**
   - Create TypeScript types and interfaces
   - Build ApplicationTracker main component
   - Create ApplicationCard component
   - Implement progress bar visualization
   - Add basic list/grid view

3. **Phase 3: Component Management (Week 3)**
   - Build ComponentChecklist component
   - Implement component status updates
   - Add component completion tracking
   - Create component icons/badges

4. **Phase 4: Application Management (Week 4)**
   - Build CreateApplicationModal
   - Add application editing functionality
   - Implement status updates
   - Add notes/annotations feature

5. **Phase 5: Integration & Polish (Week 5)**
   - Integrate with existing ApplicationTimeline
   - Add deadline reminders
   - Connect with essay management
   - Add filtering and sorting
   - Implement search functionality

### Dependencies

**Backend:**
- No new dependencies required (uses existing FastAPI, Pydantic)

**Frontend:**
- No new dependencies required (uses existing React, Next.js, Lucide icons)

### Testing Considerations

**Backend Tests:**
- Test progress calculation with various component combinations
- Test deadline urgency detection
- Test missing component identification
- Test status transitions (e.g., can't go from "submitted" to "in_progress")

**Frontend Tests:**
- Test component status updates
- Test progress bar rendering
- Test application creation flow
- Test filtering and sorting
- Test responsive design

### UI/UX Considerations

- Use color coding for status (green=completed, yellow=in progress, red=overdue)
- Show progress percentage prominently
- Display deadline countdown
- Provide quick actions (checkboxes for components)
- Show visual indicators for missing required components
- Add tooltips explaining each component
- Implement drag-and-drop for reordering (optional)

### Future Enhancements

- Email/SMS notifications for deadlines
- Integration with calendar apps
- Bulk operations (mark multiple components complete)
- Export application summary as PDF
- Template applications (pre-fill common components)
- Application analytics dashboard

