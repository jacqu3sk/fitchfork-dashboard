/**
 * Base URL used for all API requests.
 */
export const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3000/api';

/**
 * Standardized shape for all API responses.
 *
 * @template T - The expected type of the `data` payload.
 */
export interface ApiResponse<T> {
  /** Indicates if the request was successful. */
  success: boolean;

  /** The actual response data from the server. */
  data: T;

  /** A human-readable message from the server. */
  message: string;
}

/**
 * A wrapper around `fetch` for JSON-based API requests.
 *
 * - Automatically injects the auth token from `localStorage`.
 * - Handles token expiration.
 * - Parses and returns the API response as `ApiResponse<T>`.
 *
 * @template T - The expected shape of `data` in the response.
 * @param endpoint - API path or full URL.
 * @param options - `fetch` options like method, headers, body.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Construct full URL if only path is provided
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Load token and expiry from localStorage
  const stored = localStorage.getItem('auth');
  let token: string | null = null;
  let expires_at: string | null = null;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      token = parsed?.token || null;
      expires_at = parsed?.expires_at || null;
    } catch {
      token = null;
    }
  }

  // If token is expired, clear it and return early
  if (expires_at && new Date(expires_at) < new Date()) {
    localStorage.removeItem('auth');
  }

  // Prepare headers including optional Authorization
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  // // Log outgoing request
  // console.log('[apiFetch] →', {
  //   url,
  //   method: finalOptions.method || 'GET',
  //   headers: finalOptions.headers,
  //   body: finalOptions.body,
  // });

  // Perform fetch request
  const res = await fetch(url, finalOptions);

  let data: ApiResponse<T>;

  // Attempt to parse JSON response
  try {
    data = await res.json();
  } catch (err) {
    console.error('[apiFetch] Failed to parse JSON response', err);
    throw new Error('Failed to parse response from server.');
  }

  // // Log incoming response
  // console.log('[apiFetch] ←', {
  //   status: res.status,
  //   ok: res.ok,
  //   data,
  // });

  return data;
}