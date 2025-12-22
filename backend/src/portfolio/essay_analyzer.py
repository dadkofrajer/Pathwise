"""
Essay Analysis Service
Provides AI-powered analysis of college application essays
"""

from typing import Optional
import json
import os
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import textstat
from .models import EssayAnalysis, EssaySuggestion

# Load environment variables
env_paths = [
    os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'),
    os.path.join(os.path.dirname(__file__), '..', '..', '.env'),
    os.path.join(os.getcwd(), '.env'),
    '.env'
]
for env_path in env_paths:
    abs_path = os.path.abspath(env_path)
    if os.path.exists(abs_path):
        load_dotenv(dotenv_path=abs_path)
        break
else:
    load_dotenv()

_openai_api_key = os.getenv("OPENAI_API_KEY")
if _openai_api_key:
    _openai_api_key = _openai_api_key.strip().strip('"').strip("'")
client = OpenAI(api_key=_openai_api_key) if _openai_api_key else None


class EssayAnalyzer:
    """Analyzes college application essays using AI and text analysis"""
    
    def __init__(self, openai_client: Optional[OpenAI] = None):
        self.client = openai_client or client
        if not self.client:
            raise ValueError("OpenAI client not initialized. Please set OPENAI_API_KEY environment variable.")
    
    def analyze_essay(
        self,
        essay_text: str,
        essay_id: Optional[str] = None,
        prompt: Optional[str] = None,
        target_word_count: Optional[int] = None
    ) -> EssayAnalysis:
        """Comprehensive essay analysis"""
        
        # Basic metrics
        word_count = len(essay_text.split())
        readability = textstat.flesch_reading_ease(essay_text)
        
        # AI-powered analysis
        analysis = self._get_ai_analysis(essay_text, prompt, target_word_count)
        
        # Structure analysis
        structure_score, _ = self._analyze_structure(essay_text)
        
        # Prompt alignment
        alignment_score = self._check_prompt_alignment(essay_text, prompt) if prompt else 7.0
        
        # Generate suggestions
        suggestions = self._generate_suggestions(essay_text, analysis, prompt)
        
        # Generate ID if not provided
        analysis_id = f"analysis-{datetime.now().isoformat()}-{hash(essay_text) % 10000}"
        
        return EssayAnalysis(
            id=analysis_id,
            essay_id=essay_id or "unknown",
            overall_score=analysis.get("overall_score", 7.0),
            strengths=analysis.get("strengths", []),
            weaknesses=analysis.get("weaknesses", []),
            structure_score=structure_score,
            content_score=analysis.get("content_score", 7.0),
            tone_score=analysis.get("tone_score", 7.0),
            prompt_alignment_score=alignment_score,
            readability_score=readability,
            word_count=word_count,
            target_word_count=target_word_count,
            suggestions=suggestions,
            created_at=datetime.now().isoformat()
        )
    
    def _get_ai_analysis(
        self,
        essay_text: str,
        prompt: Optional[str],
        target_word_count: Optional[int]
    ) -> dict:
        """Use GPT to analyze essay content, tone, and quality"""
        prompt_text = f"""Analyze this college application essay and provide detailed feedback.

Essay:
{essay_text}

{f'Prompt: {prompt}' if prompt else ''}
{f'Target word count: {target_word_count}' if target_word_count else ''}

Provide a JSON response with:
1. overall_score: number between 0-10
2. strengths: array of 3-5 key strengths
3. weaknesses: array of 3-5 key weaknesses
4. content_score: number between 0-10
5. tone_score: number between 0-10

Return only valid JSON."""
        
        if not self.client:
            return {
                "overall_score": 7.0,
                "strengths": ["Essay submitted for analysis"],
                "weaknesses": ["OpenAI API not configured"],
                "content_score": 7.0,
                "tone_score": 7.0
            }
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Using mini for cost efficiency, can upgrade to gpt-4
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert college admissions essay reviewer. Provide detailed, constructive feedback in JSON format."
                    },
                    {"role": "user", "content": prompt_text}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            
            # Ensure all required fields exist with defaults
            return {
                "overall_score": float(result.get("overall_score", 7.0)),
                "strengths": result.get("strengths", []),
                "weaknesses": result.get("weaknesses", []),
                "content_score": float(result.get("content_score", 7.0)),
                "tone_score": float(result.get("tone_score", 7.0))
            }
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            # Return default analysis on error
            return {
                "overall_score": 7.0,
                "strengths": ["Essay has been submitted for analysis"],
                "weaknesses": ["Unable to complete full analysis"],
                "content_score": 7.0,
                "tone_score": 7.0
            }
    
    def _analyze_structure(self, essay_text: str) -> tuple[float, dict]:
        """Analyze essay structure (intro, body, conclusion)"""
        paragraphs = [p.strip() for p in essay_text.split("\n\n") if p.strip()]
        
        has_intro = len(paragraphs) > 0 and len(paragraphs[0].split()) > 50
        has_body = len(paragraphs) > 1
        has_conclusion = len(paragraphs) > 2
        
        # Check for thesis statement in intro
        intro_has_thesis = False
        if has_intro and len(paragraphs) > 0:
            intro_lower = paragraphs[0].lower()
            intro_has_thesis = any(
                word in intro_lower 
                for word in ["because", "although", "however", "therefore", "thus", "consequently"]
            )
        
        # Calculate structure score (0-10 scale)
        structure_score = 0.0
        if has_intro:
            structure_score += 3.0
            if intro_has_thesis:
                structure_score += 1.0
        if has_body:
            structure_score += 4.0
        if has_conclusion:
            structure_score += 2.0
        
        # Normalize to 0-10 scale
        structure_score = min(structure_score, 10.0)
        
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
        alignment_prompt = f"""Rate how well this essay addresses the prompt on a scale of 0-10.

Prompt: {prompt}

Essay: {essay_text}

Consider:
- Does the essay directly address the prompt?
- Does it stay on topic?
- Does it meet all requirements?

Return only a number between 0 and 10."""
        
        if not self.client:
            return 7.0
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at evaluating how well essays address their prompts. Return only a number."
                    },
                    {"role": "user", "content": alignment_prompt}
                ],
                temperature=0.2
            )
            
            content = response.choices[0].message.content.strip()
            # Extract number from response
            import re
            numbers = re.findall(r'\d+\.?\d*', content)
            if numbers:
                score = float(numbers[0])
                return max(0.0, min(10.0, score))
            return 7.0
        except Exception as e:
            print(f"Error in prompt alignment check: {e}")
            return 7.0
    
    def _generate_suggestions(
        self,
        essay_text: str,
        analysis: dict,
        prompt: Optional[str]
    ) -> list[EssaySuggestion]:
        """Generate specific improvement suggestions"""
        suggestion_prompt = f"""Based on this essay analysis, provide 5-7 specific, actionable suggestions.

Essay:
{essay_text}

Analysis:
{json.dumps(analysis, indent=2)}

{f'Prompt: {prompt}' if prompt else ''}

For each suggestion, provide a JSON object with:
- type: one of "structure", "content", "tone", "grammar", "clarity", "prompt_alignment"
- priority: "high", "medium", or "low"
- location: specific sentence/paragraph reference if applicable (e.g., "paragraph 2", "opening sentence")
- current_text: the text that needs improvement (if applicable, quote exact text)
- suggested_text: improved version (if applicable)
- explanation: why this change helps (2-3 sentences)

Return a JSON object with a "suggestions" array containing these objects."""
        
        if not self.client:
            return [
                EssaySuggestion(
                    type="content",
                    priority="medium",
                    explanation="OpenAI API not configured. Please set OPENAI_API_KEY to get detailed suggestions."
                )
            ]
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert essay editor. Provide specific, actionable suggestions in JSON format."
                    },
                    {"role": "user", "content": suggestion_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.4
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            
            suggestions_data = result.get("suggestions", [])
            suggestions = []
            
            for sug in suggestions_data[:7]:  # Limit to 7 suggestions
                try:
                    suggestion = EssaySuggestion(
                        type=sug.get("type", "content"),
                        priority=sug.get("priority", "medium"),
                        location=sug.get("location"),
                        current_text=sug.get("current_text"),
                        suggested_text=sug.get("suggested_text"),
                        explanation=sug.get("explanation", "No explanation provided")
                    )
                    suggestions.append(suggestion)
                except Exception as e:
                    print(f"Error parsing suggestion: {e}")
                    continue
            
            return suggestions
        except Exception as e:
            print(f"Error generating suggestions: {e}")
            # Return a default suggestion
            return [
                EssaySuggestion(
                    type="content",
                    priority="medium",
                    explanation="Review the essay for clarity and impact. Consider adding specific examples and details."
                )
            ]

