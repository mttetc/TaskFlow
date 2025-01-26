import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TASKS_QUERY_KEY } from './types';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { Task, TaskSchema } from '@/schemas/task';

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: async (id: number): Promise<Task> => {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid task ID');
      }

      try {
        const response = await api<unknown>(`/tasks/${id}`, {
          method: 'DELETE'
        });

        const result = TaskSchema.safeParse(response);
        
        if (!result.success) {
          console.error('Delete validation error:', result.error);
          throw new Error(`Invalid response data: ${result.error.message}`);
        }
        
        return result.data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setAuthenticated(false);
        }
        throw error;
      }
    },
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Optimistically remove the task
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, old => 
        old?.filter(task => task.id !== deletedId) ?? []
      );

      return { previousTasks };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }

      const message = error instanceof ApiError 
        ? error.data?.error || error.message
        : error.message || 'Failed to delete task';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });
}