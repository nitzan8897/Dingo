import axios, { AxiosInstance } from 'axios';

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

  async upsertCase(caseData: any) {
    const response = await this.client.post('/cases', caseData);
    return response.data;
  }

  async findLawyerByName(name: string) {
    const response = await this.client.get(`/lawyers/search/${encodeURIComponent(name)}`);
    return response.data;
  }

  async createPendingLawyer(name: string) {
    const response = await this.client.post('/lawyers/pending', { name });
    return response.data;
  }

  async addCaseToLawyer(lawyerId: string, caseId: string) {
    await this.client.patch(`/lawyers/${lawyerId}/cases/${caseId}`);
  }
}
