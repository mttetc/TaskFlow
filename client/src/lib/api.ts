let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function resetCsrfToken() {
  csrfToken = null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<TResponse>(url: string, options: RequestInit = {}): Promise<TResponse> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  // Only add CSRF token if not an auth endpoint (except logout) and not auth check
  const isAuthEndpoint = url.startsWith('/auth/');
  const isAuthCheck = url === '/auth/check';
  const isLogout = url === '/auth/logout';
    
  if ((!isAuthEndpoint || isLogout) && !isAuthCheck) {
    if (!csrfToken) {
      // If we don't have a CSRF token, get one from auth/check
      try {
        const checkResponse = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!checkResponse.ok) {
          throw new ApiError('Authentication required', checkResponse.status);
        }
        
        const checkData = await checkResponse.json();
        
        if (checkData.csrfToken) {
          csrfToken = checkData.csrfToken;
        } else {
          throw new ApiError('No CSRF token in response', 401);
        }
      } catch (error) {
        console.error('Error during auth check:', error);
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('Failed to get CSRF token', 401);
      }
    }
    
    // Add CSRF token to headers
    if (!csrfToken) {
      throw new ApiError('No CSRF token available', 401);
    }
    headers.set('csrf-token', csrfToken); // Ensure exact case match with server
  }

  // Ensure credentials are included
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  // If body is provided, ensure it's stringified
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`/api${url}`, config);

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') ? await response.json() : null;
    
    // Update CSRF token if present in response
    const newCsrfToken = data?.csrfToken;
    if (newCsrfToken) {
      setCsrfToken(newCsrfToken);
    }
    
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        resetCsrfToken(); // Clear CSRF token on auth errors
      }
      throw new ApiError(
        data?.error || 'API request failed',
        response.status,
        data
      );
    }
    
    return data as TResponse;
  } catch (error) {
    console.error('Request error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
}
