import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const StatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']);

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').nullable(),
  priority: PriorityEnum,
  status: StatusEnum,
  category: z.string().max(50, 'Category must be less than 50 characters').nullable(),
  dueDate: z.string().datetime({ message: 'Invalid date format' }).nullable(),
  userId: z.number(),
});

export const CreateTaskSchema = TaskSchema.omit({ 
  id: true, 
  userId: true 
}).extend({
  priority: PriorityEnum.default('MEDIUM'),
  status: StatusEnum.default('TODO'),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

// Infer types from schemas
export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

// Validation functions
export const validateTask = (data: unknown) => TaskSchema.parse(data);
export const validateCreateTask = (data: unknown) => CreateTaskSchema.parse(data);
export const validateUpdateTask = (data: unknown) => UpdateTaskSchema.parse(data);

// Safe parsing functions (returns success/error instead of throwing)
export const safeValidateTask = (data: unknown) => TaskSchema.safeParse(data);
export const safeValidateCreateTask = (data: unknown) => CreateTaskSchema.safeParse(data);
export const safeValidateUpdateTask = (data: unknown) => UpdateTaskSchema.safeParse(data); 