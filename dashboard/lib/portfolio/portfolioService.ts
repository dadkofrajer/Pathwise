import { PortfolioAnalysis } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch portfolio analysis from the backend API
 * @param requestData The portfolio analysis request payload
 * @returns Promise with portfolio analysis data
 */
export async function fetchPortfolioAnalysis(requestData: any): Promise<PortfolioAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio analysis: ${response.statusText}`);
    }

    const data = await response.json();
    return data as PortfolioAnalysis;
  } catch (error) {
    console.error('Error fetching portfolio analysis:', error);
    throw error;
  }
}

/**
 * Load portfolio analysis from localStorage (for cached data)
 */
export function loadCachedPortfolioAnalysis(): PortfolioAnalysis | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('portfolio_analysis');
    if (stored) {
      return JSON.parse(stored) as PortfolioAnalysis;
    }
  } catch (error) {
    console.error('Error loading cached portfolio analysis:', error);
  }

  return null;
}

/**
 * Cache portfolio analysis to localStorage
 */
export function cachePortfolioAnalysis(data: PortfolioAnalysis): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('portfolio_analysis', JSON.stringify(data));
  } catch (error) {
    console.error('Error caching portfolio analysis:', error);
  }
}

