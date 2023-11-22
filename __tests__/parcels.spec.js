import { randomUUID as uuid } from "node:crypto"
import request from "supertest"
import createApp from "../src/app"
import createTestHelpers from "../testHelpers"

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
      email = `email-${uuid()}@test.com`;
      password = `password-${uuid()}`;

      sender = await randomSender({ email, password });
    });

    afterAll(async () => {
      await sender.delete();
    });

    test("Authenticated senders can create parcels", async () => {
      return request(app)
        .post("/api/parcel")
        .set("Content-Type", "application/json")
        .auth(email, password)
        .send({
          dimensions: {
            height: 50,
            width: 25,
            depth: 10
          },
          address: "Main Street 123"
        })
        .expect(201)
        .expect("Location", /\/api\/parcel\/[^/]+/);
    });

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
