const { v4: uuid } = require("uuid");

const randomNumber = (min = 0, max = min + 1) =>
  Math.floor(Math.random() * (max - min + 1) + min);

module.exports = ({ Recipient, Sender, Parcel }) => {
  const randomRecipient = async (attributes = {}) => {
    return await new Recipient({
      address: `Test Address ${uuid()}`,
      ...attributes
    }).save();
  };

  const randomSender = async (attributes = {}) => {
    const sender = await new Sender({
      email: `test-email-${uuid()}@test.com`,
      name: `test name-${uuid()}`,
      password: uuid(),
      maxVolume: attributes.maxVolume ?? 100000,
      ...attributes,
    }).save()

    return sender;
  };

  const randomParcel = async (attributes = {}) => {
    const sender = attributes.sender ? attributes.sender : await randomSender();
    const recipient = attributes.recipient
      ? attributes.recipient
      : await randomRecipient();
    return await new Parcel({
      sender: sender._id,
      recipient: recipient._id,
      width: randomNumber(1),
      height: randomNumber(1),
      depth: randomNumber(1)
    }).save();
  };

  return {
    randomParcel,
    randomSender,
    randomRecipient
  };
};
