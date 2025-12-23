const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Activity {
  id: string;
  title: string;
  lens: string;
  type: string;
  area_of_activity?: string;
  role_level: string;
  start_date?: string;
  end_date?: string;
  hours_per_week?: number;
  team_size?: number;
  awards?: Array<{ level: string }>;
  theme_tags?: string[];
  people_impacted?: number;
  hours_total?: number;
  artifact_links?: string[];
  description_raw?: string;
}

export interface StudentProfile {
  student_id: string;
  current_grade: string;
  intended_major?: string;
  gpa_unweighted?: number;
  gpa_weighted?: number;
  curriculum?: string;
  weekly_hours_cap?: number;
  grades_by_subject?: Record<string, string>;
  tests?: {
    sat?: { score?: number; date?: string };
    act?: { score?: number; date?: string };
  };
  constraints?: string[];
}

export async function getProfile(studentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${studentId}`);
    if (!response.ok) {
      // If 404, return empty profile (not an error)
      if (response.status === 404) {
        return { profile: null, activities: [] };
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Return empty state on network errors
    return { profile: null, activities: [] };
  }
}

export async function updateProfile(studentId: string, profile: StudentProfile) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${response.statusText} - ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

export async function getActivities(studentId: string): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${studentId}/activities`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function addActivity(studentId: string, activity: Activity): Promise<Activity> {
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${studentId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`Failed to add activity: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Activity added successfully:', result);
      return result;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - backend server may not be responding. Please ensure the backend is running on port 8000.');
      }
      // Check for network errors
      if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running: cd backend && uvicorn main:app --reload');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('addActivity error:', error);
    throw error;
  }
}

export async function updateActivity(studentId: string, activityId: string, activity: Activity): Promise<Activity> {
  const response = await fetch(`${API_BASE_URL}/profile/${studentId}/activities/${activityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!response.ok) {
    throw new Error('Failed to update activity');
  }
  return response.json();
}

export async function deleteActivity(studentId: string, activityId: string) {
  const response = await fetch(`${API_BASE_URL}/profile/${studentId}/activities/${activityId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete activity');
  }
  return response.json();
}

// Portfolio Analysis Types
export interface RecommendationTask {
  title: string;
  track: string;
  estimated_hours: number;
  definition_of_done: string[];
  micro_coaching: string;
  quick_links: string[];
}

export interface CriticalImprovementSection {
  gap_type: string;
  gap_description: string;
  severity: number;
  tasks: RecommendationTask[];
}

export interface LensImprovementSection {
  lens: string;
  current_score: number;
  improvement_opportunity: string;
  tasks: RecommendationTask[];
}

export interface DiversitySpikeSection {
  has_spike: boolean;
  spike_theme?: string;
  spike_share?: number;
  coverage_index: number;
  needs_improvement: boolean;
  tasks: RecommendationTask[];
}

export interface AlignmentPriority {
  school_name: string;
  alignment_score: number;
  is_high_alignment: boolean;
  priority_tasks: string[];
  alignment_notes: string;
}

export interface TestAnalysis {
  school_name: string;
  test_policy: string;
  test_type?: string;
  current_score?: number;
  mid50_scores?: number[];
  competitiveness?: string;
  recommendation: string;
  rationale: string;
  tasks: RecommendationTask[];
}

export interface PortfolioAnalyzeRequest {
  country_tracks: string[];
  schools: string[];
  deadlines: Record<string, string>;
  weekly_hours_cap: number;
  student_profile?: StudentProfile;
  portfolio: Activity[];
}

export interface PortfolioAnalyzeResponse {
  scores: {
    impact_total: number;
    lens_scores: Record<string, number>;
    coverage: number;
    spike?: {
      theme: string;
      share: number;
    };
    alignment?: Record<string, number>;
  };
  gaps: Array<{
    type: string;
    lens?: string;
    severity: number;
  }>;
  critical_improvements: CriticalImprovementSection[];
  lens_improvements: LensImprovementSection[];
  diversity_spike?: DiversitySpikeSection;
  alignment_priorities: AlignmentPriority[];
  standardized_tests: TestAnalysis[];
}

export async function analyzePortfolio(request: PortfolioAnalyzeRequest): Promise<PortfolioAnalyzeResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for analysis
    
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to analyze portfolio: ${response.statusText} - ${errorText}`);
      }
      
      return response.json();
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Analysis timeout - the analysis is taking too long. Please try again.');
      }
      if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    throw error;
  }
}

