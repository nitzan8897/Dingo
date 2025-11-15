/**
 * Environment configuration for the mobile app
 *
 * In production, these should be loaded from environment variables
 * For now, using localhost for development
 */

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/v1',
} as const;
