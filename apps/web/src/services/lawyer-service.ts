import { Lawyer } from '@dingo/types';
import { ENV } from '@/config/env';

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
 * Uses Next.js enhanced fetch with automatic caching and revalidation
 */
export class LawyerService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ENV.API_URL;
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

      // Next.js enhanced fetch with caching
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lawyers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }
}

// Export singleton instance
export const lawyerService = new LawyerService();
