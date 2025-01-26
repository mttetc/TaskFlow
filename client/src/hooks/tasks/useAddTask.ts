import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { TASKS_QUERY_KEY } from './types';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { CreateTask, Task, TaskSchema } from '@/schemas/task';

export function useAddTask(options?: UseMutationOptions<unknown, Error, unknown, unknown>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: async (taskData: CreateTask): Promise<Task> => {
      const validationResult = TaskSchema.safeParse(taskData);
      if (!validationResult.success) {
        throw new Error(`Invalid task data: ${validationResult.error.message}`);
      }

      try {
        const response = await api<unknown>('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });

        const result = TaskSchema.safeParse(response);
        
        if (!result.success) {
          console.error('Create task validation error:', result.error);
          throw new Error(`Invalid response data: ${result.error.message}`);
        }
        
        return result.data;
      } catch (error) {
        console.error('Failed to create task:', error);
        if (error instanceof ApiError && error.status === 401) {
          setAuthenticated(false);
        }
        throw error;
      }
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, old => {
        const tempTask = { 
          ...newTask, 
          id: Date.now(),
          userId: 0, // Will be set by server
        };
        return [...(old || []), tempTask];
      });

      return { previousTasks };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }

      const message = error instanceof ApiError 
        ? error.data?.error || error.message
        : error.message || 'Failed to add task';

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
        description: 'Task added successfully'
      });

      options?.onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: TASKS_QUERY_KEY,
        exact: true,
        refetchType: 'all'
      });
    }
  });
}