let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function resetCsrfToken() {
  csrfToken = null;
}

export async function api(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  // Only add CSRF token if not an auth endpoint (except logout) and not auth check
  const isAuthEndpoint = url.startsWith('/auth/');
  const isAuthCheck = url === '/auth/check';
  const isLogout = url === '/auth/logout';
  
  if ((!isAuthEndpoint || isLogout) && !isAuthCheck) {
    // Add CSRF token to headers if we have one
    if (csrfToken) {
      headers.set('csrf-token', csrfToken);
    } else {
      throw new Error('CSRF token required but not available');
    }
  }
  
  // Add content type if not set and we have a body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure credentials are included
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(`/api${url}`, config);
  const data = await response.json();
  
  // Store CSRF token if it's in the response
  if (data.csrfToken) {
    setCsrfToken(data.csrfToken);
  }
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}
