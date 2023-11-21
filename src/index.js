const config = require("config");
const createApp = require("./app");

const main = async () => {
  const { app } = await createApp();
  app.listen(config.get("app.port"), () => {
    console.log(
      `Application is running at http://localhost:${config.get("app.port")}`
    );
  });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
