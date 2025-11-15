import axios from 'axios';
import { Lawyer } from '@dingo/types';
import { ENV } from '@/config/env';

interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const lawyerService = {
  fetchLawyers: async (params?: FetchLawyersParams): Promise<Lawyer[]> => {
    try {
      const { data } = await api.get<Lawyer[]>('/lawyers', {
        params: {
          specialties: params?.specialties?.join(','),
          city: params?.city,
        },
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch lawyers'
        );
      }
      throw error instanceof Error
        ? error
        : new Error('An unknown error occurred');
    }
  },
};
