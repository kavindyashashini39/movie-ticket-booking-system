/**
 * Central API Client for Cinema Booking System Frontend
 * Automatically injects the X-Client-Secret security header for Gateway authentication.
 */

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080';
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || 'CinemaClientSecret2026!';

/**
 * Builds request headers with X-Client-Secret and optional JWT Bearer token
 * @param {string|null} token - JWT Token if available
 * @param {object} customHeaders - Additional headers
 * @returns {object} Headers dictionary
 */
export function getApiHeaders(token = null, customHeaders = {}) {
  const headers = {
    'X-Client-Secret': CLIENT_SECRET,
    ...customHeaders
  };

  // If token was provided or is in localStorage, attach Authorization header
  const resolvedToken = token || localStorage.getItem('token');
  if (resolvedToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${resolvedToken}`;
  }

  return headers;
}

/**
 * Unified fetch wrapper ensuring all requests send X-Client-Secret to API Gateway
 */
export async function apiFetch(endpointOrUrl, options = {}) {
  const targetUrl = endpointOrUrl.startsWith('http')
    ? endpointOrUrl
    : `${GATEWAY_URL}${endpointOrUrl.startsWith('/') ? '' : '/'}${endpointOrUrl}`;

  const headers = getApiHeaders(options.token, {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  });

  return fetch(targetUrl, {
    ...options,
    headers
  });
}
