import { Schema } from 'mongoose'
import { z } from 'zod'

export const recipientInput = z.object({
  address: z.object({
    type: z.string(),
  }),
})
type RecipientInput = z.infer<typeof recipientInput>

export const recipientSchema = new Schema<RecipientInput>({
  address: { type: String, required: true },
})
