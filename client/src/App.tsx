import { AuthForm } from '@/components/auth/AuthForm';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { useAuthStore } from '@/stores/auth';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { api, resetCsrfToken } from '@/lib/api';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

function App() {
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const { isLoading } = useCheckAuth();

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAuthenticated(false);
      resetCsrfToken();
    }
  };

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <Header
        openTasksCount={0}
        onLogout={logout}
      />

      <TabNavigation />
    </div>
  );
}

export default App;