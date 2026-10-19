// API Base URL resolver: uses VITE_API_URL if set in production (e.g. Render backend URL),
// or falls back to empty string for relative paths in local development via Vite proxy.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
};
