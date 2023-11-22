/* eslint-disable @typescript-eslint/ban-types */
import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto'
import { Schema } from 'mongoose'
import { promisify } from 'util'
import { z } from 'zod'
const pbkdf2Async = promisify(pbkdf2)
const KEY_LENGTH = 64

export const SenderInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
export type SenderInput = z.infer<typeof SenderInputSchema>

export interface SenderMethods {
  authenticate: (password: string) => Promise<boolean>
}

// export type SenderModelType = Model<SenderInput, never, SenderMethods>

export const senderSchema = new Schema<SenderInput, any, SenderMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
})

senderSchema.pre('save', async function save() {
  if (!this.isModified('password')) {
    return
  }
  const salt = randomBytes(8).toString('hex')
  const iterations = Math.floor(Math.random() * (10000 - 8000 + 1) + 8000)
  const hash = await pbkdf2Async(
    this.password,
    salt,
    iterations,
    KEY_LENGTH,
    'sha512'
  )
  this.password = `${salt}::${iterations}::${hash.toString('hex')}`
})

senderSchema.method(
  'authenticate',
  async function authenticate(password: string) {
    const [salt, iterations, hash] = this.password.split('::')
    const passwordHash = await pbkdf2Async(
      password,
      salt,
      Number(iterations),
      KEY_LENGTH,
      'sha512'
    )
    return timingSafeEqual(
      Buffer.from(passwordHash.toString('hex')),
      Buffer.from(hash)
    )
  }
)
