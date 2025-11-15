import axios, { AxiosInstance } from 'axios';
import { CreateCaseDTO, Case, Lawyer } from '@dingo/types';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:3001/v1';
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }

  async upsertCase(caseData: CreateCaseDTO): Promise<Case> {
    const response = await this.client.post<Case>('/cases', caseData);
    return response.data;
  }

  async findLawyerByName(name: string): Promise<Lawyer | null> {
    const response = await this.client.get<Lawyer | null>(`/lawyers/search/${encodeURIComponent(name)}`);
    return response.data;
  }

  async createPendingLawyer(name: string): Promise<Lawyer> {
    const response = await this.client.post<Lawyer>('/lawyers/pending', { name });
    return response.data;
  }

  async addCaseToLawyer(lawyerId: string, caseId: string): Promise<void> {
    await this.client.patch(`/lawyers/${lawyerId}/cases/${caseId}`);
  }
}

