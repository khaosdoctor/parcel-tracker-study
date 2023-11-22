import { type NextFunction, type Request, type Response } from 'express'
import { type CustomError } from './errors.js'

export default (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.message, {
    status: err.status,
    stack: err.stack,
  })

  if (res.headersSent) {
    next(err)
    return
  }

  return res.status(err.status || 500).json({ error: err.message })
}
