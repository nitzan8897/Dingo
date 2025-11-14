/**
 * Environment configuration for the web app
 *
 * Centralized configuration for environment variables
 */

export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
} as const;
