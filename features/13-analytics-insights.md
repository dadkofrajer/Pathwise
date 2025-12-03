# Analytics & Insights - Implementation Plan

## Overview
Comprehensive analytics dashboard providing insights into application progress, success rates, time management, and portfolio improvement over time.

## Goals
- Track application success rates
- Analyze time spent on applications
- Monitor portfolio improvement
- Provide personalized insights
- Generate progress reports

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class ApplicationAnalytics(BaseModel):
    student_id: str
    total_applications: int
    submitted: int
    accepted: int
    waitlisted: int
    rejected: int
    acceptance_rate: float
    time_per_application: dict[str, float]  # school_id -> hours
    essay_completion_rate: float
    portfolio_improvement: dict[str, float]  # metric -> improvement

class ProgressReport(BaseModel):
    id: str
    student_id: str
    report_period: str  # "weekly", "monthly"
    start_date: str
    end_date: str
    achievements: list[str]
    improvements: list[str]
    recommendations: list[str]
    created_at: str
```

#### Service Layer
```python
# backend/src/portfolio/analytics_service.py

class AnalyticsService:
    def calculate_application_analytics(
        self,
        student_id: str
    ) -> ApplicationAnalytics:
        """Calculate application statistics"""
        # Get all applications
        # Calculate success rates
        # Analyze time spent
        pass
    
    def generate_progress_report(
        self,
        student_id: str,
        period: str = "monthly"
    ) -> ProgressReport:
        """Generate progress report"""
        # Analyze period
        # Identify achievements
        # Generate recommendations
        pass
    
    def track_portfolio_improvement(
        self,
        student_id: str
    ) -> dict:
        """Track portfolio metrics over time"""
        # Compare snapshots
        # Calculate improvements
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.get("/analytics/{student_id}/applications")
async def get_application_analytics(student_id: str):
    """Get application analytics"""
    pass

@router.get("/analytics/{student_id}/progress-report")
async def get_progress_report(
    student_id: str,
    period: str = "monthly"
):
    """Get progress report"""
    pass

@router.get("/analytics/{student_id}/portfolio-improvement")
async def get_portfolio_improvement(student_id: str):
    """Get portfolio improvement tracking"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/analytics/
├── AnalyticsDashboard.tsx           # Main dashboard
├── ApplicationStats.tsx           # Application statistics
├── TimeManagementChart.tsx          # Time tracking
├── PortfolioImprovementChart.tsx    # Portfolio growth
├── ProgressReport.tsx              # Progress report
└── InsightsPanel.tsx               # Personalized insights
```

### Implementation Steps

1. **Phase 1: Data Collection (Week 1)**
   - Build analytics data models
   - Implement data aggregation
   - Create calculation logic

2. **Phase 2: Visualization (Week 2)**
   - Build chart components
   - Create dashboard layout
   - Add filtering

3. **Phase 3: Insights (Week 3)**
   - Build insight generation
   - Create progress reports
   - Add recommendations

### Dependencies

**Backend:**
- No new dependencies

**Frontend:**
- `recharts` (for charts and visualizations)

