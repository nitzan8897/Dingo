/**
 * Environment configuration for the mobile app
 *
 * In production, these should be loaded from environment variables
 * For now, using localhost for development
 */

// Use a simple default without process.env to avoid build errors
// When using Expo, environment variables can be accessed through app.config.js
export const ENV = {
  API_URL: 'http://localhost:3001/v1',
} as const;
