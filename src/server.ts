import * as Hapi from '@hapi/hapi'
import { defineRoutes } from './routes'
import { zod_adapter } from './plugins/zod-validator'

const init_server = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 4343,
  })

  server.validator(zod_adapter)

  defineRoutes(server)

  await server.initialize()
  await server.start()

  return init_server
}


