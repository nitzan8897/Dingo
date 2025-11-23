/**
 * Environment configuration for the web app
 *
 * Centralized configuration for environment variables
 * Uses API_URL for server-side requests (Docker internal network)
 * Falls back to NEXT_PUBLIC_API_URL for client-side requests
 */

export const ENV = {
  API_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
} as const;
