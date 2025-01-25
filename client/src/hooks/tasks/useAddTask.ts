import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TASKS_QUERY_KEY, TaskMutationResponse, validateTaskMutationResponse } from './types';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import { CreateTask, Task } from '@/schemas/task';

export function useAddTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  return useMutation({
    mutationFn: async (taskData: CreateTask): Promise<TaskMutationResponse> => {
      try {
        const response = await api<unknown>('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });
        console.log('Create task response:', response);

        const result = validateTaskMutationResponse(response);
        console.log('Create task validation result:', result);
        
        if (!result.success) {
          console.error('Create task validation error:', result.error);
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
    onSuccess: (data) => {
      console.log('Create task success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      
      toast({
        title: 'Success',
        description: data.message || 'Task added successfully'
      });
    },
    onSettled: () => {
      console.log('Create task settled, forcing refetch');
      queryClient.invalidateQueries({ 
        queryKey: TASKS_QUERY_KEY,
        exact: true,
        refetchType: 'all'
      });
    }
  });
}