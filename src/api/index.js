const { AsyncRouter } = require("express-async-router");
const { middleware: auth } = require("./auth");
const sender = require("./sender");
const parcel = require("./parcel");

module.exports = models => {
  const router = AsyncRouter();

  router.use("/sender", sender(models));
  router.use("/parcel", auth(), parcel(models));

  return router;
};
