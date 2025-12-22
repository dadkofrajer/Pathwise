export interface LearningTask {
  id: string;
  title: string;
  track: string;
  estimated_hours: number;
  definition_of_done: string[];
  micro_coaching: string;
  quick_links: string[];
  lensName?: string;
  gapDescription?: string;
}

export interface TaskStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
}

export interface TaskProgress {
  taskId: string;
  completedSteps: string[];
  currentStep: number;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  timeSpent?: number; // in minutes
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

