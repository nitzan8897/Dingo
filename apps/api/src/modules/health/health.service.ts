import { Injectable } from '@nestjs/common';
import { HealthResponse } from '@dingo/types';

/**
 * Health service
 * Single Responsibility: Only handles health check logic
 */
@Injectable()
export class HealthService {
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
