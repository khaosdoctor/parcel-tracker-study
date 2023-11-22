const { AsyncRouter } = require("express-async-router");
const { CustomError } = require('../../errors')
const config = require('config')

module.exports = ({ Parcel, Recipient }) => {
  const router = AsyncRouter()

  router.get('/:id', async (req, res) => {
    const parcel = await Parcel.findById(req.params.id, '-__v')
      .lean()
      .populate({ path: 'sender', select: '_id name email' })
      .populate({ path: 'recipient', select: 'address -_id' })

    if (!parcel) {
      return res.send(404).end()
    }

    if (parcel.sender._id.toString() !== req.user._id.toString()) {
      return res.status(401).end()
    }

    return res.json(parcel)
  })

  router.post('/', async (req, res) => {
    const sender = req.user
    const { dimensions } = req.body
    const { height, width, depth } = dimensions
    const volume = height * width * depth
    const maxVolume = sender.maxVolume ?? config.get('app.defaultMaxVolume')
    if (maxVolume <= volume) {
      throw new CustomError('Parcel volume is too large', 403)
    }

    const currentMonth = new Date().getMonth() + 1
    const parcelsFromMerchant = await Parcel.find({
      sender: sender._id,
      registeredAt: { $expr: { $eq: [{ $month: currentMonth }] } },
    })
    const totalVolume = parcelsFromMerchant.reduce((acc, { width, depth, height }) => {
      acc += width * depth * height
      return acc
    }, 0)

    if (sender.monthlyVolume > 0 && totalVolume > sender.monthlyVolume) {
      throw new CustomError('Monthly volume of parcels exceeded', 403)
    }

    const recipientData = { address: req.body.address }
    const recipient = await Recipient.findOneAndUpdate(recipientData, recipientData, {
      new: true,
      upsert: true,
      useFindAndModify: false,
    }).exec()

    const parcel = await new Parcel({
      sender,
      ...dimensions,
      recipient: recipient.id,
    }).save()

    return res.status(201).location(`/api/parcel/${parcel.id}`).end()
  })

  return router
}
