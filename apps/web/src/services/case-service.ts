import { Case, CaseFilterParams } from '@dingo/types';
import { ENV } from '@/config/env';

/**
 * Case Service
 * Handles all API requests related to cases
 * Following Single Responsibility Principle - only handles case data fetching
 * Uses Next.js enhanced fetch with automatic caching and revalidation
 */
export class CaseService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ENV.API_URL;
  }

  /**
   * Fetch cases from the API
   * @param params - Optional filters for search, specialty, name, year, and status
   * @returns Promise with array of cases
   */
  async fetchCases(params?: CaseFilterParams): Promise<Case[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.specialty) {
        queryParams.append('specialty', params.specialty);
      }
      if (params?.name) {
        queryParams.append('name', params.name);
      }
      if (params?.year) {
        queryParams.append('year', params.year.toString());
      }
      if (params?.status) {
        queryParams.append('status', params.status);
      }

      const url = `${this.baseUrl}/cases${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cases: ${response.statusText}`);
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
   * Fetch a single case by external ID
   * @param externalId - Court system case ID
   * @returns Promise with case object
   */
  async fetchCaseByExternalId(externalId: string): Promise<Case> {
    try {
      const url = `${this.baseUrl}/cases/${externalId}`;

      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch case: ${response.statusText}`);
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

export const caseService = new CaseService();
