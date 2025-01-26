import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { TASKS_QUERY_KEY } from './types';
import { useToast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Task, TaskSchema, UpdateTask, UpdateTaskSchema } from '@/schemas/task';

interface UpdateTaskPayload {
  id: number;
  data: UpdateTask;
}

export function useUpdateTask(options?: UseMutationOptions<unknown, Error, unknown, unknown>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: async ({ id, data }: UpdateTaskPayload): Promise<Task> => {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid task ID');
      }

      const validationResult = UpdateTaskSchema.safeParse(data);
      if (!validationResult.success) {
        throw new Error(`Invalid task data: ${validationResult.error.message}`);
      }

      try {
        const response = await api<unknown>(`/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        const result = TaskSchema.safeParse(response);
        
        if (!result.success) {
          console.error('Update validation error:', result.error);
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
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Optimistically update the task
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, old => 
        old?.map(task => 
          task.id === id ? { ...task, ...data } : task
        ) ?? []
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
        : error.message || 'Failed to update task';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        title: 'Success',
        description: 'Task updated successfully'
      });
      options?.onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });
}