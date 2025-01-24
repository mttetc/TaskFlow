export interface User {
  id: number;
  username: string;
}

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  userId: number;
}

export interface AuthResponse {
  token: string;
  error?: string;
}

export interface TodoResponse {
  todos: Todo[];
  error?: string;
}