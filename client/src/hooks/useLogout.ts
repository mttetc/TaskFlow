import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

export function useLogout() {
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: async () => {
      await api('/auth/logout', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      setAuthenticated(false);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still set authenticated to false even if the API call fails
      // as we want to clear the local state
      setAuthenticated(false);
    }
  });
}