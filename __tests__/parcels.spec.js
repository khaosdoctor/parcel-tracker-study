const { v4: uuid } = require("uuid");
const request = require("supertest");
const createApp = require("../src/app");
const createTestHelpers = require("../testHelpers");

describe("Parcels", () => {
  let app, dbConnection, randomSender, randomRecipient, randomParcel;

  beforeAll(async () => {
    const resources = await createApp();
    app = resources.app;
    dbConnection = resources.dbConnection;
    const testHelpers = createTestHelpers(resources.models);
    randomSender = testHelpers.randomSender;
    randomRecipient = testHelpers.randomRecipient;
    randomParcel = testHelpers.randomParcel;
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  test("Unauthenticated senders cannot create parcels", async () => {
    return request(app)
      .post("/api/parcel")
      .set("Content-Type", "application/json")
      .send({
        dimensions: {
          height: 50,
          width: 25,
          depth: 10
        },
        address: "Main Street 123"
      })
      .expect(401);
  });

  describe("Authenticated senders", () => {
    let email, password, sender;

    beforeAll(async () => {
      email = `email-${uuid()}@test.com`
      password = `password-${uuid()}`

      sender = await randomSender({ email, password, maxVolume: 100000 })
    })

    afterAll(async () => {
      await sender.delete()
    })

    test('Authenticated senders can create parcels', async () => {
      return request(app)
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

    test('Parcels should not go above a volume threshold', async () => {
      const credentials = {
        email: 'bigsender@test.com',
        password: 'password',
      }
      const smallerVolumeSender = await randomSender({ ...credentials, maxVolume: 100 })
      await request(app)
        .post('/api/parcel')
        .set('Content-Type', 'application/json')
        .auth(credentials.email, credentials.password)
        .send({
          dimensions: {
            height: 10,
            width: 10,
            depth: 10,
          },
          address: 'Main Street 123',
        })
        .expect(403)

      await smallerVolumeSender.delete()
    })

    test.only('Parcels should use the default max volume if the sender already exists', async () => {
      const credentials = {
        email: 'novolume@test.com',
        password: 'password',
      }
      const noVolumeSender = await randomSender({ ...credentials })
      await request(app)
        .post('/api/parcel')
        .set('Content-Type', 'application/json')
        .auth(credentials.email, credentials.password)
        .send({
          dimensions: {
            height: 1,
            width: 1,
            depth: 1,
          },
          address: 'Main Street 123',
        })
        .expect(201)

      await noVolumeSender.delete()
    })

    test('Parcels should be added if they are within bounds', async () => {
      return request(app)
        .post('/api/parcel')
        .set('Content-Type', 'application/json')
        .auth(email, password)
        .send({
          dimensions: {
            height: 10,
            width: 10,
            depth: 10,
          },
          address: 'Main Street 123',
        })
        .expect('Location', /\/api\/parcel\/[^/]+/)
        .expect(201)
    })

    test("Authenticated senders can read their own parcels", async () => {
      const recipient = await randomRecipient();
      const parcel = await randomParcel({ sender, recipient });

      return request(app)
        .get(`/api/parcel/${parcel.id}`)
        .auth(email, password)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining({
              _id: parcel.id,
              depth: parcel.depth,
              width: parcel.width,
              height: parcel.height,
              sender: expect.objectContaining({
                _id: sender.id,
                name: sender.name,
                email: sender.email
              }),
              recipient: {
                address: recipient.address
              }
            })
          );
        });
    });

    test("Authenticated senders can not read others parcels", async () => {
      const otherSender = await randomSender();
      const recipient = await randomRecipient();
      const parcel = await randomParcel({ sender: otherSender, recipient });

      return request(app)
        .get(`/api/parcel/${parcel.id}`)
        .auth(email, password)
        .expect(401);
    });
  });
});
