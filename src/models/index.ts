import { type Connection } from 'mongoose'
import { parcelSchema } from './schemas/parcel.js'
import { recipientSchema } from './schemas/recipient.js'
import { senderSchema } from './schemas/sender.js'

export async function createModels(dbConnection: Connection) {
  const Parcel = dbConnection.model('Parcel', parcelSchema)
  const Sender = dbConnection.model('Sender', senderSchema)
  const Recipient = dbConnection.model('Recipient', recipientSchema)

  return { Parcel, Sender, Recipient }
}
export type ModelList = Awaited<ReturnType<typeof createModels>>
