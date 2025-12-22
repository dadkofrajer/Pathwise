# Portfolio Enhancement Tools - Implementation Plan

## Overview
Advanced portfolio analysis tools including impact tracking, "what-if" scenarios, activity recommendations, and portfolio strength visualization.

## Goals
- Track portfolio growth over time
- Show impact of new activities on scores
- Enable "what-if" scenario planning
- Recommend activities based on gaps
- Visualize portfolio strength

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class PortfolioSnapshot(BaseModel):
    id: str
    student_id: str
    snapshot_date: str
    lens_scores: dict[str, float]
    impact_total: float
    coverage: float
    spike_theme: Optional[str] = None
    portfolio_items: list[str]  # Evidence IDs
    created_at: str

class WhatIfScenario(BaseModel):
    id: str
    student_id: str
    base_portfolio: list[str]  # Current evidence IDs
    added_activities: list[dict]  # Hypothetical activities
    projected_scores: dict  # Projected lens scores
    impact_delta: float
    created_at: str
```

#### Service Layer
```python
# backend/src/portfolio/portfolio_enhancement.py

class PortfolioEnhancementService:
    def create_snapshot(
        self,
        student_id: str,
        portfolio: list[Evidence]
    ) -> PortfolioSnapshot:
        """Create portfolio snapshot for tracking"""
        # Calculate current scores
        # Store snapshot
        pass
    
    def simulate_what_if(
        self,
        student_id: str,
        current_portfolio: list[Evidence],
        hypothetical_activity: Evidence
    ) -> WhatIfScenario:
        """Simulate adding an activity"""
        # Add hypothetical activity
        # Recalculate scores
        # Show impact
        pass
    
    def recommend_activities(
        self,
        student_id: str,
        portfolio: list[Evidence],
        gaps: list[dict],
        weekly_hours: int
    ) -> list[RecommendationTask]:
        """Recommend activities to fill gaps"""
        # Use existing recommendation logic
        # Prioritize by impact
        pass
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/portfolio/snapshot", response_model=PortfolioSnapshot)
async def create_portfolio_snapshot(request: CreateSnapshotRequest):
    """Create portfolio snapshot"""
    pass

@router.get("/portfolio/snapshots/{student_id}")
async def get_portfolio_history(student_id: str):
    """Get portfolio snapshots over time"""
    pass

@router.post("/portfolio/what-if", response_model=WhatIfScenario)
async def simulate_what_if(request: WhatIfRequest):
    """Simulate adding activity"""
    pass

@router.get("/portfolio/strength/{student_id}")
async def get_portfolio_strength(student_id: str):
    """Get portfolio strength analysis"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/portfolio/
├── PortfolioTimeline.tsx            # Growth over time
├── WhatIfSimulator.tsx              # Scenario planning
├── PortfolioStrengthDashboard.tsx  # Strength visualization
├── ActivityImpactPreview.tsx        # Impact preview
└── PortfolioComparison.tsx          # Compare scenarios
```

### Implementation Steps

1. **Phase 1: Snapshot System (Week 1)**
   - Build snapshot creation
   - Create timeline visualization
   - Add growth tracking

2. **Phase 2: What-If Simulator (Week 2)**
   - Build simulation engine
   - Create UI for adding hypothetical activities
   - Show projected impact

3. **Phase 3: Strength Dashboard (Week 3)**
   - Build strength analysis
   - Create visualizations
   - Add recommendations

### Dependencies

**Backend:**
- No new dependencies (uses existing portfolio analysis)

**Frontend:**
- `recharts` (for timeline and comparison charts)

