import z from 'zod'
import { createPasswordSchema } from '../shared/password-schema'

export const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/

export const createChangePasswordSchema = () =>
  z
    .object({
      old_password: z.string().min(1, 'Current password is required'),
      new_password: createPasswordSchema().max(
        100,
        'Password must not exceed 100 characters'
      ),
      confirm_password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password']
    })

export const changePasswordSchema = createChangePasswordSchema() // fallback

export type ChangePasswordFormPayload = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export type ForgotPasswordFormPayload = z.infer<typeof forgotPasswordSchema>

export const forgotPasswordResetSchema = () =>
  z
    .object({
      password: createPasswordSchema().max(
        100,
        'Password must not exceed 100 characters'
      ),
      confirm_password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
    })
    .refine((data) => data.password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password']
    })

export type ForgotPasswordResetFormPayload = z.infer<
  ReturnType<typeof forgotPasswordResetSchema>
>
