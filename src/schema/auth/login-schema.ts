import { z } from 'zod'

export const createLoginSchema = () =>
  z.object({
    login: z
      .string()
      .trim()
      .refine(
        (val) => {
          if (val.includes('@')) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
          } else {
            return val.length >= 1
          }
        },
        { message: 'Invalid username or email' }
      )
      .max(100, {
        message: 'Username or email is too long (max. 100 characters)'
      }),
    password: z.string().min(1, { message: 'Password is required' }),
    remember_me: z.boolean().optional()
  })

export const loginSchema = createLoginSchema()

export type LoginInput = z.infer<typeof loginSchema>

export const createForgotPasswordSchema = () =>
  z.object({
    login: z
      .string()
      .trim()
      .refine(
        (val) => {
          if (val.includes('@')) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
          } else {
            return val.length >= 1
          }
        },
        { message: 'Invalid username or email' }
      )
  })

export const forgotPasswordSchema = createForgotPasswordSchema()

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
