import { useQuery } from '@tanstack/react-query';
import { Todo } from '@/types';
import { TODOS_QUERY_KEY } from './types';
import { api } from '../../lib/api';

export function useGetTodos() {
  return useQuery<Todo[]>({    
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => api('/todos'),
    refetchOnMount: false,
    initialData: []
  });
}