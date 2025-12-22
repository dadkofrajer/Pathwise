import { LearningTask, TaskStep } from './types';

/**
 * Generate a unique ID for a task based on its title and lens
 */
export function generateTaskId(task: { title: string; lensName?: string }): string {
  const base = task.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const lens = task.lensName ? `-${task.lensName.toLowerCase()}` : '';
  return `${base}${lens}`;
}

/**
 * Convert definition_of_done into structured steps
 */
export function parseSteps(task: LearningTask): TaskStep[] {
  return task.definition_of_done.map((item, index) => ({
    id: `step-${index + 1}`,
    title: item,
    description: undefined, // Can be enhanced with AI-generated descriptions
    completed: false,
    order: index + 1,
  }));
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completedSteps: string[], totalSteps: number): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps.length / totalSteps) * 100);
}

/**
 * Get next step to work on
 */
export function getNextStep(steps: TaskStep[]): TaskStep | null {
  return steps.find(step => !step.completed) || null;
}

