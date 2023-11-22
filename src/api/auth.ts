/* eslint-disable @typescript-eslint/no-namespace */
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { type ModelList } from '../models/index.js'
import { type SenderInput } from '../models/schemas/sender.js'

// Passport doesn't know about our User type, so we need to extend the Express
declare global {
  namespace Express {
    interface User extends SenderInput {
      _id: string
    }
  }
}

const init = (Sender: ModelList['Sender']) =>
  passport.use(
    new BasicStrategy(async function (username, password, done) {
      let err = null
      let user = null
      const sender = await Sender.findOne({ email: username }).exec()
      if (!sender) {
        done(err, user)
        return
      }

      const matches = await sender.authenticate(password)

      if (matches) {
        user = sender
      } else {
        err = null
        user = false
      }

      done(err, user)
    })
  )

const middleware = () => passport.authenticate('basic', { session: false })

export { init, middleware }
