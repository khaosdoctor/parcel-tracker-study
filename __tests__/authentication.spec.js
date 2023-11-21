const { v4: uuid } = require("uuid");
const request = require("supertest");
const createApp = require("../src/app");

describe("Authentication", () => {
  let app, dbConnection;

  beforeAll(async () => {
    const resources = await createApp();
    app = resources.app;
    dbConnection = resources.dbConnection;
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  test("Senders can register", async () => {
    return request(app)
      .post("/api/sender")
      .send({
        email: `test-${uuid()}@test.com`,
        name: `name-${uuid()}`,
        password: uuid()
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .then(response => {
        expect(response.body.sender).toEqual(expect.any(String));
      });
  });
});
