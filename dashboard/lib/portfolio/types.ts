export interface PortfolioTask {
  title: string;
  track: string;
  estimated_hours: number;
  definition_of_done: string[];
  micro_coaching: string;
  quick_links: string[];
}

export interface CriticalImprovement {
  gap_type: string;
  gap_description: string;
  severity: number;
  tasks: PortfolioTask[];
}

export interface LensScores {
  Curiosity: number;
  Growth: number;
  Community: number;
  Creativity: number;
  Leadership: number;
  Achievements: number;
}

export interface PortfolioAnalysis {
  critical_improvements: CriticalImprovement[];
  scores?: {
    lens_scores?: LensScores;
  };
}

