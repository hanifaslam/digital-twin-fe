import { z } from 'zod'

export const createBuildingSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  longitude: z
    .string()
    .min(1, 'Required')
    .regex(/^-?\d+(\.\d+)?$/, 'Longitude must be a number'),
  latitude: z
    .string()
    .min(1, 'Required')
    .regex(/^-?\d+(\.\d+)?$/, 'Latitude must be a number'),
  radius: z
    .string()
    .min(1, 'Required')
    .regex(/^\d+$/, 'Radius must be a number'),
  code: z.string().trim().min(1, 'Required'),
  status: z.boolean()
})

export type CreateBuildingPayload = z.infer<typeof createBuildingSchema>

export const updateBuildingSchema = createBuildingSchema.partial()

export type UpdateBuildingPayload = z.infer<typeof updateBuildingSchema>
