import {z} from 'zod'
import {CONSTRAINTS} from './constants'

export const registerSchema = z.object({
  username: z.string().min(CONSTRAINTS.username.min, `At least ${CONSTRAINTS.username.min} characters`).max(CONSTRAINTS.username.max, `Max ${CONSTRAINTS.username.max} characters`),
  email: z.email('Invalid email'),
  password: z.string().min(CONSTRAINTS.password.min, `At least ${CONSTRAINTS.password.min} characters`).max(CONSTRAINTS.password.max, `Max ${CONSTRAINTS.password.max} characters`),
  confirmPassword: z.string(),
  race_id: z.number().min(1, 'Please choose your race'),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ['confirmPassword'] }
);

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;