# Essay Analysis & Feedback - Implementation Plan

## Overview
AI-powered essay analysis system that provides comprehensive feedback on structure, content, tone, readability, and alignment with prompts. Helps students improve their essays through actionable insights.

## Goals
- Provide detailed essay analysis and feedback
- Identify strengths and weaknesses
- Suggest improvements for structure and content
- Check alignment with essay prompts
- Offer readability and word count optimization

## Technical Requirements

### Backend Changes

#### Database Schema
```python
# backend/src/portfolio/models.py

class EssayAnalysis(BaseModel):
    id: str
    essay_id: str
    overall_score: float = Field(ge=0.0, le=10.0)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    structure_score: float = Field(ge=0.0, le=10.0)
    content_score: float = Field(ge=0.0, le=10.0)
    tone_score: float = Field(ge=0.0, le=10.0)
    prompt_alignment_score: float = Field(ge=0.0, le=10.0)
    readability_score: float = Field(ge=0.0, le=100.0)  # Flesch-Kincaid
    word_count: int
    target_word_count: Optional[int] = None
    suggestions: list[EssaySuggestion] = Field(default_factory=list)
    created_at: str

class EssaySuggestion(BaseModel):
    type: Literal["structure", "content", "tone", "grammar", "clarity", "prompt_alignment"]
    priority: Literal["high", "medium", "low"]
    location: Optional[str] = None  # Sentence/paragraph reference
    current_text: Optional[str] = None
    suggested_text: Optional[str] = None
    explanation: str

class EssayPrompt(BaseModel):
    id: str
    school_id: Optional[str] = None
    prompt_text: str
    word_limit: Optional[int] = None
    character_limit: Optional[int] = None
    category: Optional[str] = None  # "personal_statement", "supplemental", etc.
```

#### Analysis Service
```python
# backend/src/portfolio/essay_analyzer.py

from openai import OpenAI
import re
from textstat import flesch_reading_ease

class EssayAnalyzer:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
    
    def analyze_essay(
        self,
        essay_text: str,
        prompt: Optional[str] = None,
        target_word_count: Optional[int] = None
    ) -> EssayAnalysis:
        """Comprehensive essay analysis"""
        
        # Basic metrics
        word_count = len(essay_text.split())
        readability = flesch_reading_ease(essay_text)
        
        # AI-powered analysis
        analysis = self._get_ai_analysis(essay_text, prompt, target_word_count)
        
        # Structure analysis
        structure_score, structure_feedback = self._analyze_structure(essay_text)
        
        # Prompt alignment
        alignment_score = self._check_prompt_alignment(essay_text, prompt) if prompt else 7.0
        
        # Generate suggestions
        suggestions = self._generate_suggestions(essay_text, analysis, prompt)
        
        return EssayAnalysis(
            overall_score=analysis["overall_score"],
            strengths=analysis["strengths"],
            weaknesses=analysis["weaknesses"],
            structure_score=structure_score,
            content_score=analysis["content_score"],
            tone_score=analysis["tone_score"],
            prompt_alignment_score=alignment_score,
            readability_score=readability,
            word_count=word_count,
            target_word_count=target_word_count,
            suggestions=suggestions
        )
    
    def _get_ai_analysis(
        self,
        essay_text: str,
        prompt: Optional[str],
        target_word_count: Optional[int]
    ) -> dict:
        """Use GPT to analyze essay content, tone, and quality"""
        prompt_text = f"""
Analyze this college application essay and provide detailed feedback.

Essay:
{essay_text}

{f'Prompt: {prompt}' if prompt else ''}
{f'Target word count: {target_word_count}' if target_word_count else ''}

Provide:
1. Overall score (0-10)
2. List of 3-5 key strengths
3. List of 3-5 key weaknesses
4. Content quality score (0-10)
5. Tone appropriateness score (0-10)
6. Specific suggestions for improvement

Return as JSON.
"""
        # Call OpenAI API
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt_text}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    
    def _analyze_structure(self, essay_text: str) -> tuple[float, dict]:
        """Analyze essay structure (intro, body, conclusion)"""
        paragraphs = essay_text.split("\n\n")
        
        has_intro = len(paragraphs) > 0 and len(paragraphs[0].split()) > 50
        has_body = len(paragraphs) > 1
        has_conclusion = len(paragraphs) > 2
        
        # Check for thesis statement in intro
        intro_has_thesis = any(
            word in paragraphs[0].lower() 
            for word in ["because", "although", "however", "therefore"]
        ) if has_intro else False
        
        structure_score = (
            (has_intro * 3) +
            (has_body * 4) +
            (has_conclusion * 2) +
            (intro_has_thesis * 1)
        )
        
        feedback = {
            "has_intro": has_intro,
            "has_body": has_body,
            "has_conclusion": has_conclusion,
            "paragraph_count": len(paragraphs),
            "intro_has_thesis": intro_has_thesis
        }
        
        return structure_score, feedback
    
    def _check_prompt_alignment(
        self,
        essay_text: str,
        prompt: str
    ) -> float:
        """Check how well essay addresses the prompt"""
        # Use AI to check alignment
        alignment_prompt = f"""
Rate how well this essay addresses the prompt (0-10):

Prompt: {prompt}

Essay: {essay_text}

Return only a number between 0 and 10.
"""
        # Call OpenAI API
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": alignment_prompt}]
        )
        try:
            return float(response.choices[0].message.content.strip())
        except:
            return 7.0
    
    def _generate_suggestions(
        self,
        essay_text: str,
        analysis: dict,
        prompt: Optional[str]
    ) -> list[EssaySuggestion]:
        """Generate specific improvement suggestions"""
        suggestions = []
        
        # Generate AI suggestions
        suggestion_prompt = f"""
Based on this essay analysis, provide 5-7 specific, actionable suggestions.

Essay: {essay_text}
Analysis: {json.dumps(analysis)}

For each suggestion, provide:
- type: structure, content, tone, grammar, clarity, or prompt_alignment
- priority: high, medium, or low
- location: specific sentence/paragraph reference if applicable
- current_text: the text that needs improvement (if applicable)
- suggested_text: improved version (if applicable)
- explanation: why this change helps

Return as JSON array.
"""
        # Call OpenAI API and parse suggestions
        # ... implementation ...
        
        return suggestions
```

#### API Endpoints
```python
# backend/src/portfolio/api.py

@router.post("/essays/{essay_id}/analyze", response_model=EssayAnalysis)
async def analyze_essay(
    essay_id: str,
    prompt_id: Optional[str] = None,
    regenerate: bool = False
):
    """Analyze an essay and return feedback"""
    pass

@router.get("/essays/{essay_id}/analysis", response_model=EssayAnalysis)
async def get_essay_analysis(essay_id: str):
    """Get existing analysis for an essay"""
    pass

@router.post("/essays/analyze-text")
async def analyze_essay_text(
    essay_text: str = Body(...),
    prompt_text: Optional[str] = Body(None),
    target_word_count: Optional[int] = Body(None)
):
    """Analyze essay text directly (for draft analysis)"""
    pass

@router.get("/essays/{essay_id}/suggestions")
async def get_essay_suggestions(essay_id: str, type: Optional[str] = None):
    """Get filtered suggestions by type"""
    pass
```

### Frontend Changes

#### New Components
```
dashboard/components/essays/
├── EssayAnalyzer.tsx                # Main analysis component
├── EssayAnalysisPanel.tsx           # Analysis results panel
├── EssayScoreCard.tsx               # Score visualization
├── EssayStrengthsWeaknesses.tsx     # Strengths/weaknesses display
├── EssaySuggestionsList.tsx         # Suggestions with actions
├── EssaySuggestionItem.tsx          # Individual suggestion
├── PromptAlignmentChecker.tsx       # Prompt alignment display
├── ReadabilityScore.tsx             # Readability indicator
└── WordCountOptimizer.tsx           # Word count suggestions
```

#### TypeScript Types
```typescript
// dashboard/lib/essays/types.ts (extend existing)

export interface EssayAnalysis {
  id: string;
  essayId: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  structureScore: number;
  contentScore: number;
  toneScore: number;
  promptAlignmentScore: number;
  readabilityScore: number;
  wordCount: number;
  targetWordCount?: number;
  suggestions: EssaySuggestion[];
  createdAt: string;
}

export interface EssaySuggestion {
  type: "structure" | "content" | "tone" | "grammar" | "clarity" | "prompt_alignment";
  priority: "high" | "medium" | "low";
  location?: string;
  currentText?: string;
  suggestedText?: string;
  explanation: string;
}

export type SuggestionType = EssaySuggestion["type"];
```

#### Service Layer
```typescript
// dashboard/lib/essays/essayAnalysisService.ts

export async function analyzeEssay(
  essayId: string,
  promptId?: string
): Promise<EssayAnalysis> {
  const params = new URLSearchParams();
  if (promptId) {
    params.append("prompt_id", promptId);
  }

  const response = await fetch(
    `/api/essays/${essayId}/analyze?${params}`,
    {
      method: "POST",
    }
  );
  return response.json();
}

export async function analyzeEssayText(
  essayText: string,
  promptText?: string,
  targetWordCount?: number
): Promise<EssayAnalysis> {
  const response = await fetch("/api/essays/analyze-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      essay_text: essayText,
      prompt_text: promptText,
      target_word_count: targetWordCount,
    }),
  });
  return response.json();
}

export async function getEssayAnalysis(essayId: string): Promise<EssayAnalysis | null> {
  const response = await fetch(`/api/essays/${essayId}/analysis`);
  if (response.status === 404) {
    return null;
  }
  return response.json();
}
```

#### Integration with Essay Editor
```typescript
// dashboard/components/essays/EssayEditor.tsx
// Add analysis panel that:
// - Shows analysis on demand
// - Highlights suggestions in text
// - Allows applying suggestions
// - Shows real-time word count vs target
```

### Implementation Steps

1. **Phase 1: Backend Analysis Engine (Week 1)**
   - Set up EssayAnalyzer class
   - Implement basic structure analysis
   - Add readability calculation
   - Create AI analysis integration
   - Write unit tests

2. **Phase 2: AI Analysis Integration (Week 2)**
   - Implement GPT-4 analysis prompts
   - Add prompt alignment checking
   - Create suggestion generation
   - Optimize API calls (caching, batching)
   - Add error handling

3. **Phase 3: Frontend Analysis UI (Week 3)**
   - Build EssayAnalyzer component
   - Create score visualization
   - Build strengths/weaknesses display
   - Add analysis loading states
   - Implement analysis caching

4. **Phase 4: Suggestions System (Week 4)**
   - Build EssaySuggestionsList component
   - Implement suggestion filtering
   - Add "apply suggestion" functionality
   - Create suggestion highlighting in editor
   - Add priority indicators

5. **Phase 5: Integration & Polish (Week 5)**
   - Integrate with EssayEditor
   - Add real-time analysis (optional)
   - Implement prompt alignment checker
   - Add word count optimizer
   - Polish UI/UX

### Dependencies

**Backend:**
- `textstat` (for readability scores)
- `openai` (already in use)
- `nltk` (optional, for advanced text analysis)

**Frontend:**
- No new dependencies required
- May want `react-syntax-highlighter` for code-like text display

### Analysis Features

**Structure Analysis:**
- Introduction quality
- Body paragraph organization
- Conclusion strength
- Paragraph transitions
- Thesis statement clarity

**Content Analysis:**
- Story/narrative quality
- Specificity and detail
- Authenticity and voice
- Impact and memorability
- Uniqueness

**Tone Analysis:**
- Appropriateness for audience
- Consistency throughout
- Professional vs personal balance
- Confidence level

**Prompt Alignment:**
- Directly addresses prompt
- Stays on topic
- Meets all requirements
- Word count compliance

**Readability:**
- Flesch-Kincaid Reading Ease
- Sentence length analysis
- Vocabulary level
- Clarity score

### Testing Considerations

**Backend Tests:**
- Test structure analysis with various essay formats
- Test readability calculation
- Test AI analysis with sample essays
- Test prompt alignment detection
- Test suggestion generation
- Test edge cases (very short/long essays)

**Frontend Tests:**
- Test analysis display
- Test suggestion filtering
- Test "apply suggestion" functionality
- Test score visualization
- Test loading states

### UI/UX Considerations

- Show analysis scores with color coding (green=good, yellow=ok, red=needs work)
- Display scores in circular progress indicators
- Make suggestions clickable to apply
- Highlight suggested text in editor
- Show word count with target (green if within range, red if over)
- Provide expandable sections for detailed feedback
- Add "regenerate analysis" option
- Show analysis timestamp
- Allow filtering suggestions by type/priority

### Performance Considerations

- Cache analysis results (don't re-analyze unchanged essays)
- Debounce analysis requests for real-time analysis
- Show loading states during analysis
- Consider background analysis for long essays
- Limit analysis frequency to prevent API abuse

### Future Enhancements

- Plagiarism detection integration
- Comparison with successful essays (anonymized)
- Essay improvement tracking over time
- Peer review integration
- Essay templates and examples
- A/B testing different essay versions
- Integration with grammar checkers (Grammarly API)
- Multi-language support
- Audio feedback (text-to-speech)

