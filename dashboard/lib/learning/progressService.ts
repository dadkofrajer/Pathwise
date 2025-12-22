import { TaskProgress } from './types';

const STORAGE_KEY = 'task_progress';

/**
 * Load progress for a specific task
 */
export function loadTaskProgress(taskId: string): TaskProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const allProgress = loadAllProgress();
    return allProgress[taskId] || null;
  } catch (error) {
    console.error('Error loading task progress:', error);
    return null;
  }
}

/**
 * Load all task progress
 */
export function loadAllProgress(): Record<string, TaskProgress> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading all progress:', error);
  }

  return {};
}

/**
 * Save task progress
 */
export function saveTaskProgress(progress: TaskProgress): void {
  if (typeof window === 'undefined') return;

  try {
    const allProgress = loadAllProgress();
    allProgress[progress.taskId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving task progress:', error);
  }
}

/**
 * Mark a step as completed
 */
export function completeStep(taskId: string, stepId: string): void {
  const progress = loadTaskProgress(taskId) || {
    taskId,
    completedSteps: [],
    currentStep: 0,
  };

  if (!progress.completedSteps.includes(stepId)) {
    progress.completedSteps.push(stepId);
    progress.currentStep = progress.completedSteps.length;
    saveTaskProgress(progress);
  }
}

/**
 * Unmark a step as completed
 */
export function uncompleteStep(taskId: string, stepId: string): void {
  const progress = loadTaskProgress(taskId);
  if (!progress) return;

  progress.completedSteps = progress.completedSteps.filter(id => id !== stepId);
  progress.currentStep = progress.completedSteps.length;
  saveTaskProgress(progress);
}

/**
 * Initialize progress for a new task
 */
export function initializeProgress(taskId: string): TaskProgress {
  const progress: TaskProgress = {
    taskId,
    completedSteps: [],
    currentStep: 0,
    startedAt: new Date(),
  };
  saveTaskProgress(progress);
  return progress;
}

