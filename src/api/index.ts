import { AsyncRouter } from 'express-async-router'
import { type ModelList } from '../models/index.js'
import { middleware as auth } from './auth.js'
import { parcel } from './parcel/index.js'
import { sender } from './sender/index.js'

export default (models: ModelList) => {
  const router = AsyncRouter()

  router.use('/sender', sender(models))
  router.use('/parcel', auth(), parcel(models))

  return router
}
