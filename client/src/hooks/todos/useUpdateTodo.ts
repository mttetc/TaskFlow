import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODOS_QUERY_KEY, TodoMutationResponse } from './types';
import { useToast } from '../use-toast';

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number): Promise<TodoMutationResponse> => {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ completed: true })
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Todo updated successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive'
      });
    }
  });
}