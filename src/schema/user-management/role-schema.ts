import { z } from 'zod'

export type Access = {
  id: string
  is_checked: boolean
  children?: Access[]
}

export const accessSchema: z.ZodType<Access> = z.object({
  id: z.string().min(1, 'Access ID is required'),
  is_checked: z.boolean().default(false),
  children: z.array(z.lazy(() => accessSchema)).optional()
})

export const roleSchema = () =>
  z.object({
    name: z.string().min(1, 'Required').max(25, 'Maximum 25 characters'),
    status: z.boolean().default(true),
    code: z.string().min(1, 'Required'),
    access: z.array(accessSchema).min(1, 'Select at least one access')
  })

export type CreateRolePayload = z.infer<ReturnType<typeof roleSchema>>

export const updateRoleSchema = () =>
  z.object({
    name: z.string().min(1, 'Required').max(25, 'Maximum 25 characters'),
    status: z.boolean().default(true),
    code: z.string().min(1, 'Required'),
    access: z.array(accessSchema).min(1, 'Select at least one access')
  })

export type UpdateRolePayload = z.infer<ReturnType<typeof updateRoleSchema>>
