const { Schema } = require("mongoose");

module.exports = new Schema({
  address: { type: String, required: true }
});
