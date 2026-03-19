import z from 'zod'
import { createPasswordSchema } from '../shared/password-schema'

export const createUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, 'Required')
      .regex(/^[a-zA-Z][a-zA-Z0-9._]+$/, 'Invalid username'),
    email: z.email('Invalid email'),
    name: z
      .string()
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    role_id: z.string().min(1, 'Required'),
    password: createPasswordSchema(),
    confirm_password: z.string(),
    status: z.boolean().default(true)
  })
  .refine((val) => val.password === val.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  })

export type CreateUserPayload = z.infer<typeof createUserSchema>

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, 'Required')
      .regex(/^[a-zA-Z][a-zA-Z0-9._]+$/, 'Invalid username'),
    name: z
      .string()
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    email: z.string().trim().email('Invalid email'),
    role_id: z.string().min(1, 'Required'),
    status: z.boolean().default(true)
  })
  .partial()

export type UpdateUserPayload = z.infer<typeof updateUserSchema>

export const changeUserPasswordSchema = z
  .object({
    new_password: createPasswordSchema(),
    confirm_password: z.string()
  })
  .refine((val) => val.new_password === val.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  })

export type ChangeUserPasswordPayload = z.infer<typeof changeUserPasswordSchema>
