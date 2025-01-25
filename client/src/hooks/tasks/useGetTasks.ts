import { useQuery } from '@tanstack/react-query';
import { Task, TaskSchema } from '@/schemas/task';
import { TASKS_QUERY_KEY } from './types';
import { api } from '@/lib/api';
import { z } from 'zod';

const TasksResponseSchema = z.array(TaskSchema);

export function useGetTasks() {
  return useQuery<Task[]>({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const response = await api<unknown>('/tasks');
      
      const result = TasksResponseSchema.safeParse(response);
      
      if (!result.success) {
        throw new Error(`Invalid response data: ${result.error.message}`);
      }
      
      return result.data;
    },
  });
}