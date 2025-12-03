# Essay Reuse Tracker - Implementation Plan

## Overview
A system to identify reusable essays across different college prompts, track which essays are used for which schools, and suggest adaptations for similar prompts. Helps students maximize efficiency by reusing strong essays.

## Goals
- Identify similar prompts across schools
- Track essay-to-prompt assignments
- Suggest essay adaptations for similar prompts
- Prevent duplicate submissions where not allowed
- Optimize essay writing workload

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class PromptSimilarity(BaseModel):
    prompt1_id: str
    prompt2_id: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    common_themes: list[str] = Field(default_factory=list)
    adaptation_notes: Optional[str] = None

class EssayAssignment(BaseModel):
    id: str
    essay_id: str
    prompt_id: str
    school_id: str
    application_id: str
    is_adapted: bool = False
    adaptation_notes: Optional[str] = None
    similarity_to_original: Optional[float] = None
    created_at: str

class PromptCluster(BaseModel):
    id: str
    name: str  # e.g., "Why This School", "Personal Statement"
    prompt_ids: list[str]
    representative_prompt: str
    common_elements: list[str]
```

#### Similarity Analysis Service
```python
# backend/src/portfolio/essay_similarity.py

from openai import OpenAI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class PromptSimilarityAnalyzer:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    
    def calculate_similarity(
        self,
        prompt1: str,
        prompt2: str
    ) -> tuple[float, list[str], str]:
        """Calculate similarity between two prompts"""
        
        # Vector-based similarity
        vectors = self.vectorizer.fit_transform([prompt1, prompt2])
        similarity_score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        
        # AI-powered analysis for themes and adaptation
        analysis = self._analyze_prompts_ai(prompt1, prompt2)
        
        return similarity_score, analysis["common_themes"], analysis["adaptation_notes"]
    
    def _analyze_prompts_ai(
        self,
        prompt1: str,
        prompt2: str
    ) -> dict:
        """Use AI to identify common themes and adaptation needs"""
        prompt = f"""
Compare these two college essay prompts and identify:
1. Common themes/topics they're asking about
2. Key differences that would require essay adaptation
3. How to adapt an essay written for prompt 1 to work for prompt 2

Prompt 1: {prompt1}
Prompt 2: {prompt2}

Return as JSON with:
- common_themes: array of strings
- adaptation_notes: string explaining how to adapt
"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    
    def find_similar_prompts(
        self,
        target_prompt: str,
        all_prompts: list[tuple[str, str]]  # (prompt_id, prompt_text)
    ) -> list[tuple[str, float]]:  # (prompt_id, similarity_score)
        """Find prompts similar to target"""
        similarities = []
        for prompt_id, prompt_text in all_prompts:
            score, _, _ = self.calculate_similarity(target_prompt, prompt_text)
            similarities.append((prompt_id, score))
        
        return sorted(similarities, key=lambda x: x[1], reverse=True)
    
    def suggest_adaptation(
        self,
        essay_text: str,
        original_prompt: str,
        new_prompt: str
    ) -> dict:
        """Suggest how to adapt an essay for a new prompt"""
        prompt = f"""
Analyze this essay and suggest specific adaptations to make it work for a new prompt.

Original Essay:
{essay_text}

Original Prompt:
{original_prompt}

New Prompt:
{new_prompt}

Provide:
1. Sections that need modification
2. Specific text changes
3. New content to add
4. Content to remove or de-emphasize

Return as JSON with detailed adaptation suggestions.
"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.get("/prompts/similar/{prompt_id}")
async def find_similar_prompts(
    prompt_id: str,
    threshold: float = 0.6
):
    """Find prompts similar to given prompt"""
    pass

@router.post("/prompts/compare")
async def compare_prompts(
    prompt1: str = Body(...),
    prompt2: str = Body(...)
):
    """Compare two prompts and get similarity analysis"""
    pass

@router.get("/essays/{essay_id}/reusable-prompts")
async def get_reusable_prompts(essay_id: str):
    """Get list of prompts this essay could be adapted for"""
    pass

@router.post("/essays/{essay_id}/assign")
async def assign_essay_to_prompt(
    essay_id: str,
    prompt_id: str = Body(...),
    school_id: str = Body(...),
    application_id: str = Body(...)
):
    """Assign an essay to a prompt/school"""
    pass

@router.get("/essays/{essay_id}/assignments")
async def get_essay_assignments(essay_id: str):
    """Get all schools/prompts this essay is assigned to"""
    pass

@router.post("/essays/{essay_id}/suggest-adaptation")
async def suggest_essay_adaptation(
    essay_id: str,
    target_prompt_id: str = Body(...)
):
    """Get suggestions for adapting essay to new prompt"""
    pass

@router.get("/students/{student_id}/essay-optimization")
async def get_essay_optimization_summary(student_id: str):
    """Get summary of essay reuse opportunities"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/essays/
├── EssayReuseTracker.tsx            # Main component
├── PromptSimilarityMatrix.tsx       # Visual similarity display
├── ReusablePromptsList.tsx          # List of similar prompts
├── EssayAssignmentCard.tsx           # Show essay assignments
├── AdaptationSuggestions.tsx        # Adaptation recommendations
├── EssayOptimizationSummary.tsx     # Workload optimization view
└── PromptClusterView.tsx            # Group similar prompts
```

#### TypeScript Types
```typescript
// dashboard/lib/essays/types.ts (extend existing)

export interface PromptSimilarity {
  prompt1Id: string;
  prompt2Id: string;
  similarityScore: number;
  commonThemes: string[];
  adaptationNotes?: string;
}

export interface EssayAssignment {
  id: string;
  essayId: string;
  promptId: string;
  schoolId: string;
  applicationId: string;
  isAdapted: boolean;
  adaptationNotes?: string;
  similarityToOriginal?: number;
  createdAt: string;
}

export interface AdaptationSuggestion {
  section: string;
  currentText: string;
  suggestedText: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface EssayOptimizationSummary {
  totalEssays: number;
  uniqueEssays: number;
  reusableEssays: number;
  potentialSavings: number; // hours saved
  recommendations: string[];
}
```

#### Service Layer
```typescript
// dashboard/lib/essays/essayReuseService.ts

export async function findSimilarPrompts(
  promptId: string,
  threshold: number = 0.6
): Promise<PromptSimilarity[]> {
  const response = await fetch(
    `/api/prompts/similar/${promptId}?threshold=${threshold}`
  );
  return response.json();
}

export async function assignEssayToPrompt(
  essayId: string,
  promptId: string,
  schoolId: string,
  applicationId: string
): Promise<EssayAssignment> {
  const response = await fetch(`/api/essays/${essayId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt_id: promptId,
      school_id: schoolId,
      application_id: applicationId,
    }),
  });
  return response.json();
}

export async function getReusablePrompts(
  essayId: string
): Promise<Array<{ promptId: string; similarity: number; schoolName: string }>> {
  const response = await fetch(`/api/essays/${essayId}/reusable-prompts`);
  return response.json();
}

export async function getAdaptationSuggestions(
  essayId: string,
  targetPromptId: string
): Promise<AdaptationSuggestion[]> {
  const response = await fetch(
    `/api/essays/${essayId}/suggest-adaptation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_prompt_id: targetPromptId }),
    }
  );
  return response.json();
}

export async function getEssayOptimizationSummary(
  studentId: string
): Promise<EssayOptimizationSummary> {
  const response = await fetch(`/api/students/${studentId}/essay-optimization`);
  return response.json();
}
```

#### Integration Points
```typescript
// dashboard/components/essays/EssayCard.tsx
// Add "Find Similar Prompts" button
// Show which schools this essay is assigned to

// dashboard/app/essays/page.tsx
// Add "Essay Optimization" section showing reuse opportunities
```

### Implementation Steps

1. **Phase 1: Similarity Analysis Engine (Week 1)**
   - Implement PromptSimilarityAnalyzer
   - Add vector-based similarity calculation
   - Create AI-powered theme extraction
   - Build prompt comparison endpoint
   - Write unit tests

2. **Phase 2: Assignment Tracking (Week 2)**
   - Add database models for assignments
   - Implement assignment CRUD operations
   - Create assignment tracking API
   - Build assignment visualization
   - Add duplicate detection

3. **Phase 3: Frontend Core (Week 3)**
   - Build EssayReuseTracker component
   - Create ReusablePromptsList
   - Implement prompt similarity display
   - Add essay assignment UI
   - Build assignment tracking view

4. **Phase 4: Adaptation Suggestions (Week 4)**
   - Implement adaptation suggestion engine
   - Build AdaptationSuggestions component
   - Add "apply adaptation" functionality
   - Create adaptation preview
   - Integrate with essay editor

5. **Phase 5: Optimization & Polish (Week 5)**
   - Build optimization summary
   - Add prompt clustering
   - Create workload visualization
   - Add recommendations
   - Polish UI/UX

### Dependencies

**Backend:**
- `scikit-learn` (for TF-IDF and cosine similarity)
- `openai` (already in use)
- `numpy` (for similarity calculations)

**Frontend:**
- No new dependencies required
- May want `react-flow` for visual similarity graphs (optional)

### Similarity Metrics

**Vector-Based Similarity:**
- TF-IDF vectorization
- Cosine similarity
- Fast and scalable

**AI-Powered Analysis:**
- Semantic understanding
- Theme extraction
- Adaptation guidance
- More accurate but slower

**Hybrid Approach:**
- Use vector similarity for filtering (fast)
- Use AI for detailed analysis (accurate)

### Testing Considerations

**Backend Tests:**
- Test similarity calculation with various prompts
- Test prompt clustering
- Test adaptation suggestion quality
- Test assignment tracking
- Test edge cases (identical prompts, very different prompts)

**Frontend Tests:**
- Test similarity display
- Test assignment creation
- Test adaptation suggestions display
- Test optimization summary
- Test filtering and search

### UI/UX Considerations

- Show similarity scores with color coding (green=high, yellow=medium, red=low)
- Display prompt clusters visually
- Show essay assignments in a matrix/grid
- Highlight reusable essays
- Provide one-click assignment
- Show adaptation suggestions inline
- Display workload savings prominently
- Add tooltips explaining similarity scores

### Optimization Features

**Workload Reduction:**
- Calculate hours saved by reusing essays
- Show percentage of unique vs reusable essays
- Recommend which essays to write first
- Suggest essay writing order for maximum reuse

**Quality Assurance:**
- Warn if essay is too generic (used for too many prompts)
- Check if adaptations maintain essay quality
- Validate that adapted essays still address prompts

### Future Enhancements

- Automatic essay adaptation (AI-generated adapted versions)
- Essay template library
- Prompt database with similarity pre-calculated
- Integration with Common App prompt database
- Essay version control (track adaptations)
- Analytics on reuse success rates
- Community prompt database (shared prompts)

