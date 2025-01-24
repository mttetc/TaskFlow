import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODOS_QUERY_KEY, TodoMutationResponse } from './types';
import { useToast } from '../use-toast';
import { api } from '../../lib/api';

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: number): Promise<TodoMutationResponse> => {
      const data = await api(`/todos/${id}`, {
        method: 'DELETE'
      });
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Todo deleted successfully'
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