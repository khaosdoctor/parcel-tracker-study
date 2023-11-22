import config from 'config'
import { createApp } from './app.js'

const main = async () => {
  const { app } = await createApp()
  app.listen(config.get<number>('app.port'), () => {
    console.log(
      `Application is running at http://localhost:${config.get<number>(
        'app.port'
      )}`
    )
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
