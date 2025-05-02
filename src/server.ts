import * as Hapi from '@hapi/hapi'
import { defineRoutes } from './routes'
import { zod_adapter } from './plugins/zod-validator'
import { parsed_env } from './env'

import { drizzle } from 'drizzle-orm/postgres-js'
import * as postgres from 'postgres'

const init_server = async () => {
  const server = Hapi.server({
    host: parsed_env.API_URL,
    port: parsed_env.PORT,
  })

  const client = postgres(parsed_env.DATABASE_URL, { prepare: false })
  const db = drizzle(client);

  server.validator(zod_adapter)

  defineRoutes(server)

  await server.initialize()
  await server.start()

  return init_server
}


