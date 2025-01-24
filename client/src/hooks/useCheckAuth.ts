import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

export function useCheckAuth() {
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: async () => {
      try {
        // Check auth status - will also get CSRF token if authenticated
        const { isAuthenticated } = await api('/auth/check');
        setAuthenticated(isAuthenticated);
        return isAuthenticated;
      } catch (error) {
        setAuthenticated(false);
        return false;
      }
    },
    retry: false
  });
}
