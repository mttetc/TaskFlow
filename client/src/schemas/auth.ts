import { z } from 'zod';

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration schema
export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth check response schema
export const AuthCheckResponseSchema = z.object({
  isAuthenticated: z.boolean(),
  csrfToken: z.string().optional(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string()
  }).optional()
});

// Auth response schema
export const AuthResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string()
  }),
  token: z.string().optional()
});

// Infer types from schemas
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type AuthCheckResponse = z.infer<typeof AuthCheckResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Validation functions
export const validateLogin = (data: unknown) => LoginSchema.parse(data);
export const validateRegister = (data: unknown) => RegisterSchema.parse(data);
export const validateAuthCheckResponse = (data: unknown) => AuthCheckResponseSchema.parse(data);
export const validateAuthResponse = (data: unknown) => AuthResponseSchema.parse(data);

// Safe parsing functions
export const safeValidateLogin = (data: unknown) => LoginSchema.safeParse(data);
export const safeValidateRegister = (data: unknown) => RegisterSchema.safeParse(data);
export const safeValidateAuthCheckResponse = (data: unknown) => AuthCheckResponseSchema.safeParse(data);
export const safeValidateAuthResponse = (data: unknown) => AuthResponseSchema.safeParse(data); 