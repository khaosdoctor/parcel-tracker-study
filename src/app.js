const express = require("express");
const config = require("config");
const bodyparser = require("body-parser");
const passport = require("passport");
const { init: initAuth } = require("./api/auth");
const errorHandler = require("./errorHandler");
const connectDatabase = require("./resources/database");
const initModels = require("./models");
const api = require("./api");

const createApp = async () => {
  const app = express();
  const dbConnection = await connectDatabase(config.database);
  const models = await initModels(dbConnection);
  initAuth(models.Sender);

  app.use(bodyparser.json());
  app.use(passport.initialize());

  app.use("/api", api(models));

  app.use(errorHandler);

  return { app, dbConnection, models };
};

module.exports = createApp;
