import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';
import { api, setCsrfToken } from '@/lib/api';

interface AuthResponse {
  csrfToken?: string;
  message: string;
}

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isRegistration, setIsRegistration] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }): Promise<AuthResponse> => {
      const response = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (response.csrfToken) {
        setCsrfToken(response.csrfToken);
      }
      return response;
    },
    onSuccess: () => {
      onAuthSuccess();
      toast({
        title: 'Success',
        description: 'Logged in successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (response.csrfToken) {
        setCsrfToken(response.csrfToken);
      }
      return response;
    },
    onSuccess: () => {
      setIsRegistration(false);
      toast({
        title: 'Success',
        description: 'Registration successful! Please log in.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (isRegistration) {
        await registerMutation.mutateAsync({ username, password });
      } else {
        await loginMutation.mutateAsync({ username, password });
      }
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <Card className="w-[350px] p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegistration ? 'Register' : 'Login'}
        </h2>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loginMutation.isPending || registerMutation.isPending}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginMutation.isPending || registerMutation.isPending}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          {isRegistration ? 'Register' : 'Login'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setIsRegistration(!isRegistration)}
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          {isRegistration ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Button>
      </form>
    </Card>
  );
}