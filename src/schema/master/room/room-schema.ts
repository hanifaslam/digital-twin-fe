import { z } from 'zod'

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  building_id: z.string().trim().min(1, 'Required'),
  floor: z.string().trim().min(1, 'Required'),
  status: z.boolean().default(true)
})

export type CreateRoomPayload = z.infer<typeof createRoomSchema>

export const updateRoomSchema = createRoomSchema.partial()

export type UpdateRoomPayload = z.infer<typeof updateRoomSchema>
