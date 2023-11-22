import { AsyncRouter } from 'express-async-router'
import { type ModelList } from '../../models/index.js'

export const parcel = ({ Parcel, Recipient }: ModelList) => {
  const router = AsyncRouter()

  router.get('/:id', async (req, res) => {
    const parcel = await Parcel.findById(req.params.id, '-__v')
      .lean()
      .populate({ path: 'sender', select: '_id name email' })
      .populate({ path: 'recipient', select: 'address -_id' })

    if (!parcel) {
      return res.send(404).end()
    }

    if (parcel.sender._id.toString() !== req.user?._id.toString()) {
      return res.status(401).end()
    }

    return res.json(parcel)
  })

  router.post('/', async (req, res) => {
    const sender = req.user
    const { dimensions } = req.body
    const recipientData = { address: req.body.address }
    const recipient = await Recipient.findOneAndUpdate(
      recipientData,
      recipientData,
      { new: true, upsert: true, useFindAndModify: false }
    ).exec()

    const parcel = await new Parcel({
      sender,
      ...dimensions,
      recipient: recipient.id,
    }).save()

    return res.status(201).location(`/api/parcel/${parcel.id}`).end()
  })

  return router
}
