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
   * @param options - Fetch options including limit for pagination
   * @returns Promise with array of lawyers
   */
  async fetchLawyers(
    params?: FetchLawyersParams,
    options?: { limit?: number; offset?: number }
  ): Promise<Lawyer[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.specialties && params.specialties.length > 0) {
        queryParams.append('specialties', params.specialties.join(','));
      }
      if (params?.city) {
        queryParams.append('city', params.city);
      }
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString());
      }
      if (options?.offset) {
        queryParams.append('offset', options.offset.toString());
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

  /**
   * Fetch random lawyers for homepage display
   * @param limit - Number of random lawyers to fetch
   * @returns Promise with array of random lawyers
   */
  async fetchRandomLawyers(limit: number = 5): Promise<Lawyer[]> {
    try {
      const url = `${this.baseUrl}/lawyers?random=true&limit=${limit}`;

      const response = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch random lawyers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Fallback: fetch all and pick random ones
      const allLawyers = await this.fetchLawyers();
      return [...allLawyers].sort(() => Math.random() - 0.5).slice(0, limit);
    }
  }

  /**
   * Fetch a single lawyer by ID
   * @param id - Lawyer ID
   * @returns Promise with lawyer object
   */
  async fetchLawyerById(id: string): Promise<Lawyer> {
    try {
      const url = `${this.baseUrl}/lawyers/${id}`;

      // Next.js enhanced fetch with caching
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lawyer: ${response.statusText}`);
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
