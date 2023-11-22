import { createConnection } from 'mongoose'

interface IConnection {
  host: string
  port: number
  database: string
}

export default async ({ host, port, database }: IConnection) => {
  const connectionString = `mongodb://${host}:${port}/${database}`
  return createConnection(connectionString)
}
