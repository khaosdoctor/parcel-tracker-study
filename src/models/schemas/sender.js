const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  maxVolume: { type: Number, required: true, min: 1 },
  monthlyVolume: { type: Number, required: false, default: 0 },
})

schema.pre("save", async function save() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

schema.methods.authenticate = async function authenticate(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = schema;
