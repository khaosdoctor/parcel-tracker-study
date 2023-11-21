const { AsyncRouter } = require("express-async-router");
const { MongoError } = require("../../errors");

module.exports = ({ Sender }) => {
  const router = AsyncRouter();

  router.post("/", async (req, res) => {
    const sender = new Sender({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    try {
      await sender.save();
    } catch (err) {
      throw MongoError.fromMongoose(err);
    }

    return res.status(201).json({
      sender: sender.id
    });
  });

  return router;
};
