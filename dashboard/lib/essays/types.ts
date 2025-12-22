export type EssayStatus = 'not_started' | 'in_progress' | 'complete';

export interface Essay {
  id: string;
  title: string;
  prompt: string;
  content: string;
  wordLimit: number;
  wordCount: number;
  status: EssayStatus;
  lastEdited: Date;
  collegeId?: string; // null for general essays
  collegeName?: string; // null for general essays
  googleDocUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface College {
  id: string;
  name: string;
  essays: Essay[];
}

// Essay Analysis Types
export type SuggestionType = "structure" | "content" | "tone" | "grammar" | "clarity" | "prompt_alignment";

export interface EssaySuggestion {
  type: SuggestionType;
  priority: "high" | "medium" | "low";
  location?: string;
  currentText?: string;
  suggestedText?: string;
  explanation: string;
}

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

