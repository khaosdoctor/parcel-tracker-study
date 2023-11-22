import mongoose, { Schema, isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const parcelInputSchema = z.object({
  registeredAt: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString())
    .transform((v) => new Date(v)),
  height: z.number().positive().int(),
  width: z.number().positive().int(),
  depth: z.number().positive().int(),
  sender: z
    .string()
    .refine((value) => isValidObjectId(value))
    .transform((v) => new mongoose.mongo.ObjectId(v)),
  recipient: z
    .string()
    .refine((value) => isValidObjectId(value))
    .transform((v) => new mongoose.mongo.ObjectId(v)),
})
export type ParcelInput = z.infer<typeof parcelInputSchema>

export const parcelSchema = new Schema<ParcelInput>({
  registeredAt: { type: Date, default: Date.now },
  height: { type: Number, min: 1, required: true },
  width: { type: Number, min: 1, required: true },
  depth: { type: Number, min: 1, required: true },
  sender: { type: 'ObjectId', ref: 'Sender', required: true },
  recipient: { type: 'ObjectId', ref: 'Recipient', required: true },
})
