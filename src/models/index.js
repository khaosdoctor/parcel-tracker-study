const parcelSchema = require("./schemas/parcel");
const senderSchema = require("./schemas/sender");
const recipientSchema = require("./schemas/recipient");

module.exports = async dbConnection => {
  const Parcel = dbConnection.model("Parcel", parcelSchema);
  const Sender = dbConnection.model("Sender", senderSchema);
  const Recipient = dbConnection.model("Recipient", recipientSchema);

  return { Parcel, Sender, Recipient };
};
