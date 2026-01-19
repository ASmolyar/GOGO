/**
 * API Configuration
 * 
 * Centralized configuration for API base URL.
 * In production on Vercel, API is same-origin (empty string = relative URL).
 * In development, use localhost:4000.
 */

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

export const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? ''
  : (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;
