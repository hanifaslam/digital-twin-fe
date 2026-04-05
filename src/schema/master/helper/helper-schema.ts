import { z } from 'zod'

export const createHelperSchema = z.object({
  phone_number: z
    .string()
    .trim()
    .min(1, 'Required')
    .regex(/^\d+$/, 'Phone number must contain numbers only'),
  building_ids: z.array(z.string()).min(1, 'Required'),
  user_id: z.string().min(1, 'Required'),
  status: z.boolean().default(true)
})

export type CreateHelperPayload = z.infer<typeof createHelperSchema>

export const updateHelperSchema = createHelperSchema.partial()

export type UpdateHelperPayload = z.infer<typeof updateHelperSchema>
