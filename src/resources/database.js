const mongoose = require("mongoose");

module.exports = async ({ host, port, database }) => {
  const connectionString = `mongodb://${host}:${port}/${database}`;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };

  return await mongoose.createConnection(connectionString, options);
};
