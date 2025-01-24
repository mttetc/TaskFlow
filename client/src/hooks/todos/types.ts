import { Todo } from '@/types';

export const TODOS_QUERY_KEY = ['todos'];

export interface TodoMutationResponse {
  success: boolean;
  data?: Todo;
  error?: string;
}