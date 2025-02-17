import { AuthForm } from '@/components/auth/AuthForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TasksPage } from '@/components/tasks/TasksPage';
import { useAuthStore } from '@/stores/auth';
import { useCheckAuth } from '@/hooks/useCheckAuth';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

function App() {
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const { isLoading: isAuthLoading } = useCheckAuth();

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  // Show loading spinner while checking auth status
  if (isAuthLoading) {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6 max-w-[1600px]">
        <TasksPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;