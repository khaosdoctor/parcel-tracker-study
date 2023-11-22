import config from 'config'
import express from 'express'
import passport from 'passport'
import { init as initAuth } from './api/auth.js'
import api from './api/index.js'
import errorHandler from './errorHandler.js'
import { createModels } from './models/index.js'
import connectDatabase from './resources/database.js'

export async function createApp() {
  const app = express()
  const dbConnection = await connectDatabase(config.get('database'))
  const models = await createModels(dbConnection)
  initAuth(models.Sender)

  app.use(express.json())
  app.use(passport.initialize())

  app.use('/api', api(models))

  app.use(errorHandler)

  return { app, dbConnection, models }
}
