const { Schema } = require("mongoose");

module.exports = new Schema({
  registeredAt: { type: Date, default: Date.now },
  height: { type: Number, min: 1, required: true },
  width: { type: Number, min: 1, required: true },
  depth: { type: Number, min: 1, required: true },
  sender: { type: "ObjectId", ref: "Sender", required: true },
  recipient: { type: "ObjectId", ref: "Recipient", required: true }
});
