import z from 'zod'
import { ImageFileSchema } from '../shared/helper-schema'

export const registerFaceSchema = z.object({
  image: ImageFileSchema
})

export const verifyFaceSchema = z.object({
  image: ImageFileSchema
})

export type RegisterFacePayload = z.infer<typeof registerFaceSchema>
export type VerifyFacePayload = z.infer<typeof verifyFaceSchema>
