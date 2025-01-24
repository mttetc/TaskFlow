import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODOS_QUERY_KEY, TodoMutationResponse } from './types';
import { useToast } from '../use-toast';
import { api } from '../../lib/api';

export function useAddTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (task: string): Promise<TodoMutationResponse> => {
      const data = await api('/todos', {
        method: 'POST',
        body: JSON.stringify({ task })
      });
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Todo added successfully'
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
}