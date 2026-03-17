import z from 'zod'
import { createPasswordSchema } from '../shared/password-schema'

export const createUserSchema = (
  isHousekeeping?: (roleId: string) => boolean
) =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(1, 'Required')
        .regex(/^[a-zA-Z][a-zA-Z0-9._]+$/, 'Invalid username'),
      email: z.string().trim().email('Invalid email'),
      name: z
        .string()
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters')
        .regex(/^[A-Za-zÀ-ÿ'’.-\s]+$/, 'Invalid name'),
      role_id: z.string().min(1, 'Required'),
      hotels: z.array(z.string()).min(1, 'At least one property is required'),
      password: createPasswordSchema(),
      confirm_password: z.string(),
      status: z.boolean().default(true)
    })
    .refine((val) => val.password === val.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password']
    })
    .refine(
      (data) => {
        if (isHousekeeping?.(data.role_id) && data.hotels.length > 1) {
          return false
        }
        return true
      },
      {
        message: 'Housekeeping role can only be assigned to one property',
        path: ['hotels']
      }
    )

export type CreateUserPayload = z.infer<ReturnType<typeof createUserSchema>>

export const updateUserSchema = (
  isHousekeeping?: (roleId: string) => boolean
) =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(1, 'Required')
        .regex(/^[a-zA-Z][a-zA-Z0-9._]+$/, 'Invalid username'),
      email: z.string().trim().email('Invalid email'),
      name: z
        .string()
        .min(1, 'Required')
        .max(50, 'Maximum 50 characters')
        .regex(/^[A-Za-zÀ-ÿ'’.-\s]+$/, 'Invalid name'),
      role_id: z.string().min(1, 'Required'),
      hotels: z.array(z.string()).min(1, 'At least one property is required'),
      status: z.boolean().default(true)
    })
    .partial()
    .refine(
      (data) => {
        if (
          isHousekeeping &&
          data.role_id &&
          data.hotels &&
          isHousekeeping(data.role_id) &&
          data.hotels.length > 1
        ) {
          return false
        }
        return true
      },
      {
        message: 'Housekeeping role can only be assigned to one property',
        path: ['hotels']
      }
    )

export type UpdateUserPayload = z.infer<ReturnType<typeof updateUserSchema>>

export const changeUserPasswordSchema = () =>
  z
    .object({
      new_password: createPasswordSchema(),
      confirm_password: z.string()
    })
    .refine((val) => val.new_password === val.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password']
    })

export type ChangeUserPasswordPayload = z.infer<
  ReturnType<typeof changeUserPasswordSchema>
>
