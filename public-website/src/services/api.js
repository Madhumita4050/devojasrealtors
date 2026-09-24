/**
 * Central API Client for Devojas Realtors Frontend
 * Handles backend requests, dynamic base URLs, timeouts, and graceful fallbacks.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const isBackendConfigured = () => Boolean(BASE_URL && BASE_URL.trim() !== '');

export async function apiClient(endpoint, { method = 'GET', data = null, headers = {} } = {}) {
  if (!isBackendConfigured()) {
    // Backend URL not configured in .env yet
    return { isFallback: true, error: 'No backend URL configured' };
  }

  const cleanUrl = `${BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    }
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(cleanUrl, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Server responded with status ${response.status}`);
    }

    const responseData = await response.json();
    return { success: true, data: responseData, isFallback: false };
  } catch (err) {
    console.warn(`[API Notice] Falling back to local data. Reason: ${err.message}`);
    return { success: false, error: err.message, isFallback: true };
  }
}
