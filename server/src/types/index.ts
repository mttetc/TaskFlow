import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  password: string;
  todos?: Todo[];
}

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  userId: number;
  user?: User;
}

export interface JwtPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  userId?: number;
}