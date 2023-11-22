import type mongoose from 'mongoose'
import { Error } from 'mongoose'

const MONGO_ERRORS = {
  DUPLICATE_KEY: 11000,
}

class CustomError extends Error {
  status: number = 500
  constructor(e: Error | string, status = 500) {
    const message = typeof e === 'string' ? e : e.message
    console.error('Unknown error from MongoDB', {
      error: e,
      stack: new Error(message).stack,
    })
    super(message)
    this.message = message
    this.status = status
  }
}

class MongoError extends CustomError {
  static fromMongoose(
    error: mongoose.mongo.MongoError
  ): MongoError | CustomError {
    switch (error.code) {
      case MONGO_ERRORS.DUPLICATE_KEY:
        return new MongoError('Unique constraint violated', 400)
      default:

        return new CustomError(error)
    }
  }
}

export { CustomError, MongoError }
