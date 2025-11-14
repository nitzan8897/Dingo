import { Lawyer } from '@dingo/types';

/**
 * Parameters for fetching lawyers
 */
export interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

/**
 * Lawyer Service
 * Handles all API requests related to lawyers
 * Following Single Responsibility Principle - only handles lawyer data fetching
 */
export class LawyerService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
  }

  /**
   * Fetch lawyers from the API
   * @param params - Optional filters for specialties and city
   * @returns Promise with array of lawyers
   */
  async fetchLawyers(params?: FetchLawyersParams): Promise<Lawyer[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.specialties && params.specialties.length > 0) {
        queryParams.append('specialties', params.specialties.join(','));
      }
      if (params?.city) {
        queryParams.append('city', params.city);
      }

      const url = `${this.baseUrl}/lawyers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch lawyers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lawyerService = new LawyerService();
