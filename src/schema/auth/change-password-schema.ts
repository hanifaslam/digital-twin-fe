import z from 'zod'
import { createPasswordSchema } from '../shared/password-schema'

export const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/

export const createChangePasswordSchema = (trans: (key: string) => string) =>
  z
    .object({
      old_password: z.string().min(1, trans('currentPasswordRequired')),
      new_password: createPasswordSchema(trans).max(
        100,
        trans('passwordMaxLength')
      ),
      confirm_password: z
        .string()
        .min(8, trans('passwordMinLength'))
        .max(100, trans('passwordMaxLength'))
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: trans('passwordsDoNotMatch'),
      path: ['confirm_password']
    })

export const changePasswordSchema = createChangePasswordSchema((key) => key) // fallback

export type ChangePasswordFormPayload = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>

export const forgotPasswordSchema = z.object({
  email: z.email('invalidEmailAddress')
})

export type ForgotPasswordFormPayload = z.infer<typeof forgotPasswordSchema>

export const forgotPasswordResetSchema = (trans: (key: string) => string) =>
  z
    .object({
      password: createPasswordSchema((key) => key).max(
        100,
        trans('passwordMaxLength')
      ),
      confirm_password: z
        .string()
        .min(8, trans('passwordMinLength'))
        .max(100, trans('passwordMaxLength'))
    })
    .refine((data) => data.password === data.confirm_password, {
      message: trans('passwordsDoNotMatch'),
      path: ['confirm_password']
    })

export type ForgotPasswordResetFormPayload = z.infer<
  ReturnType<typeof forgotPasswordResetSchema>
>
