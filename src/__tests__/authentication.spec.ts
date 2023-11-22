import { randomUUID as uuid } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { createApp } from '../app.js'
import assert from 'node:assert'

describe('Authentication', () => {
  let app: Awaited<ReturnType<typeof createApp>>['app']
  let dbConnection: Awaited<ReturnType<typeof createApp>>['dbConnection']

  before(async () => {
    const resources = await createApp()
    app = resources.app
    dbConnection = resources.dbConnection
  })

  after(async () => {
    await dbConnection.close()
  })

  it('Senders can register', async () => {
    const response = await request(app)
      .post('/api/sender')
      .send({
        email: `test-${uuid()}@test.com`,
        name: `name-${uuid()}`,
        password: uuid(),
      })
      .expect('Content-Type', /json/)
      .expect(201)

    assert.ok(typeof response.body.sender === 'string')
  })
})
