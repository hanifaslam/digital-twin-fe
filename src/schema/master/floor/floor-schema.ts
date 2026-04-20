import { z } from 'zod'

export const createFloorSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  status: z.boolean()
})

export type CreateFloorPayload = z.infer<typeof createFloorSchema>

export const updateFloorSchema = createFloorSchema.partial()

export type UpdateFloorPayload = z.infer<typeof updateFloorSchema>
