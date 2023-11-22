import { randomUUID } from 'crypto'
import { type ModelList } from '../models/index.js'

const randomNumber = (min = 0, max = min + 1) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const createTestHelpers = ({ Recipient, Sender, Parcel }: ModelList) => {
  const randomRecipient = async (attributes = {}) => {
    return await new Recipient({
      address: `Test Address ${randomUUID()}`,
      ...attributes,
    }).save()
  }

  const randomSender = async (attributes = {}) => {
    const sender = await new Sender({
      email: `test-email-${randomUUID()}@test.com`,
      name: `test name-${randomUUID()}`,
      password: randomUUID(),
      ...attributes,
    }).save()

    return sender
  }

  const randomParcel = async (attributes?: {
    sender?: any
    recipient?: any
  }) => {
    const parcelData = {
      width: randomNumber(1),
      height: randomNumber(1),
      depth: randomNumber(1),
      sender: attributes?.sender ? attributes.sender : await randomSender(),
      recipient: attributes?.recipient
        ? attributes.recipient
        : await randomRecipient(),
    }

    return await new Parcel(parcelData).save()
  }

  return {
    randomParcel,
    randomSender,
    randomRecipient,
  }
}
