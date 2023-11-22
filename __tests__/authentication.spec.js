const { v4: uuid } = require("uuid");
const request = require("supertest");
const createApp = require("../src/app");
const config = require('config')

describe('Authentication', () => {
  let app, dbConnection, models

  beforeAll(async () => {
    const resources = await createApp()
    app = resources.app
    models = resources.models
    dbConnection = resources.dbConnection
  })

  afterAll(async () => {
    await dbConnection.close()
  })

  test('Senders can register with default maxVolume', async () => {
    const response = await request(app)
      .post('/api/sender')
      .send({
        email: `test-${uuid()}@test.com`,
        name: `name-${uuid()}`,
        password: uuid(),
      })
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body.sender).toEqual(expect.any(String))
    const sender = await models.Sender.findOne({ _id: response.body.sender }).exec()
    expect(sender.maxVolume).toEqual(config.get('app.defaultMaxVolume'))
  })

  test('Senders can register with custom maxVolume', async () => {
    const maxVolume = 5000
    const response = await request(app)
      .post('/api/sender')
      .send({
        email: `test-${uuid()}@test.com`,
        name: `name-${uuid()}`,
        password: uuid(),
        maxVolume: maxVolume,
      })
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body.sender).toEqual(expect.any(String))
    const sender = await models.Sender.findOne({ _id: response.body.sender }).exec()
    expect(sender.maxVolume).toEqual(maxVolume)
  })
})
