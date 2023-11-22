import { type ModelList } from '../../models/index.js'

import { AsyncRouter } from 'express-async-router'
import { CustomError, MongoError } from '../../errors.js'
import mongoose from 'mongoose'

export const sender = ({ Sender }: ModelList) => {
  const router = AsyncRouter()

  router.post('/', async (req, res) => {
    const sender = new Sender({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    try {
      await sender.save()
    } catch (err) {
      if (err instanceof mongoose.mongo.MongoError) {
        throw MongoError.fromMongoose(err)
      }
      throw new CustomError(err as Error)
    }

    return res.status(201).json({
      sender: sender.id,
    })
  })

  return router
}
