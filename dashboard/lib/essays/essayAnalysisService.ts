import { EssayAnalysis } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Analyze essay text directly (for draft analysis)
 */
export async function analyzeEssayText(
  essayText: string,
  promptText?: string,
  targetWordCount?: number,
  essayId?: string
): Promise<EssayAnalysis> {
  const response = await fetch(`${API_BASE_URL}/essays/analyze-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      essay_text: essayText,
      prompt_text: promptText,
      target_word_count: targetWordCount,
      essay_id: essayId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to analyze essay' }));
    throw new Error(error.detail || 'Failed to analyze essay');
  }

  return response.json();
}

/**
 * Analyze an essay by ID
 * Note: This endpoint is available but we primarily use analyzeEssayText
 */
export async function analyzeEssay(
  essayId: string,
  essayText: string,
  promptText?: string,
  targetWordCount?: number
): Promise<EssayAnalysis> {
  const response = await fetch(`${API_BASE_URL}/essays/${essayId}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      essay_text: essayText,
      prompt_text: promptText,
      target_word_count: targetWordCount,
      essay_id: essayId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to analyze essay' }));
    throw new Error(error.detail || 'Failed to analyze essay');
  }

  return response.json();
}

/**
 * Get cached analysis for an essay (if stored)
 * Note: This is a placeholder - in a real app, you'd store analyses in a database
 */
export async function getEssayAnalysis(essayId: string): Promise<EssayAnalysis | null> {
  // For now, we don't have a GET endpoint, so return null
  // In the future, this would fetch from a database
  const cached = sessionStorage.getItem(`essay-analysis-${essayId}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Cache analysis result
 */
export function cacheAnalysis(analysis: EssayAnalysis): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`essay-analysis-${analysis.essayId}`, JSON.stringify(analysis));
  }
}

