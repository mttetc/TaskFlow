import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { AuthCheckResponse, validateAuthCheckResponse } from '@/schemas/auth';

export function useCheckAuth() {
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useQuery<AuthCheckResponse>({
    queryKey: ['auth', 'check'],
    queryFn: async () => {
      try {
        // Check auth status - will also get CSRF token if authenticated
        const response = await api('/auth/check');
        const validatedResponse = validateAuthCheckResponse(response);

        setAuthenticated(validatedResponse.isAuthenticated);
        return validatedResponse;
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthenticated(false);
        throw error;
      }
    },
    retry: false
  });
}
