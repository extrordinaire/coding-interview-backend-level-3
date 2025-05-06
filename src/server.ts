import * as Hapi from '@hapi/hapi'
import { define_routes } from './routes'
import { zod_adapter } from './plugins/zod-validator'
import { parsed_env } from './env'


export const initializeServer = async () => {
  const server = Hapi.server({
    host: parsed_env.API_URL,
    port: parsed_env.PORT,
  })

  //server.validator({
  //  compile: () => (a, b, c) => console.log('zarampion compile', a, b, c),
  //  validate: (a, b, c) => { console.log('validate', a, b, c); return true },
  //})

  server.validator(zod_adapter)

  define_routes(server)

  await server.initialize()
  await server.start()

  return server
}

