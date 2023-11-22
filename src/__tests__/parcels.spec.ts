import assert from 'node:assert'
import { randomUUID as uuid } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { createApp } from '../app.js'
import { createTestHelpers } from './testHelpers.js'

describe('Parcels', () => {
  let app: Awaited<ReturnType<typeof createApp>>['app']
  let dbConnection: Awaited<ReturnType<typeof createApp>>['dbConnection']
  let randomSender: ReturnType<typeof createTestHelpers>['randomSender']
  let randomRecipient: ReturnType<typeof createTestHelpers>['randomRecipient']
  let randomParcel: ReturnType<typeof createTestHelpers>['randomParcel']

  before(async () => {
    const resources = await createApp()
    app = resources.app
    dbConnection = resources.dbConnection
    const testHelpers = createTestHelpers(resources.models)
    randomSender = testHelpers.randomSender
    randomRecipient = testHelpers.randomRecipient
    randomParcel = testHelpers.randomParcel
  })

  after(async () => {
    await dbConnection.close()
  })

  it('Unauthenticated senders cannot create parcels', async () => {
    await request(app)
      .post('/api/parcel')
      .set('Content-Type', 'application/json')
      .send({
        dimensions: {
          height: 50,
          width: 25,
          depth: 10,
        },
        address: 'Main Street 123',
      })
      .expect(401)
  })

  describe('Authenticated senders', () => {
    let email: string
    let password: string
    let sender: Awaited<ReturnType<typeof randomSender>>

    before(async () => {
      email = `email-${uuid()}@test.com`
      password = `password-${uuid()}`

      sender = await randomSender({ email, password })
    })

    after(async () => {
      await sender.deleteOne()
    })

    it('Authenticated senders can create parcels', async () => {
      await request(app)
        .post('/api/parcel')
        .set('Content-Type', 'application/json')
        .auth(email, password)
        .send({
          dimensions: {
            height: 50,
            width: 25,
            depth: 10,
          },
          address: 'Main Street 123',
        })
        .expect(201)
        .expect('Location', /\/api\/parcel\/[^/]+/)
    })

    it('Authenticated senders can read their own parcels', async () => {
      const recipient = await randomRecipient()
      const parcel = await randomParcel({ sender, recipient })

      const response = await request(app)
        .get(`/api/parcel/${parcel.id}`)
        .auth(email, password)
        .expect(200)

      const { registeredAt, ...body } = response.body
      assert.strictEqual(typeof body, 'object')
      assert.deepStrictEqual(body, {
        _id: parcel.id,
        depth: parcel.depth,
        width: parcel.width,
        height: parcel.height,
        sender: {
          _id: sender.id,
          name: sender.name,
          email: sender.email,
        },
        recipient: {
          address: recipient.address,
        },
      })
    })

    it('Authenticated senders can not read others parcels', async () => {
      const otherSender = await randomSender()
      const recipient = await randomRecipient()
      const parcel = await randomParcel({
        sender: otherSender,
        recipient,
      })

      await request(app)
        .get(`/api/parcel/${parcel.id}`)
        .auth(email, password)
        .expect(401)
    })
  })
})
