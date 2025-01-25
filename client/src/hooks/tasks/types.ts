import { z } from 'zod';
import { TaskSchema } from '@/schemas/task';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export const TaskMutationResponseSchema = z.object({
  task: TaskSchema,
  message: z.string()
});

export type TaskMutationResponse = z.infer<typeof TaskMutationResponseSchema>;

// Validation function - only expose the safe version
export const validateTaskMutationResponse = (data: unknown) => TaskMutationResponseSchema.safeParse(data);