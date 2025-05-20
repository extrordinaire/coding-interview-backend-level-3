import * as Hapi from "@hapi/hapi";
import { define_routes } from "./routes";
import { zod_adapter } from "./plugins/zod-validator";
import { parsed_env } from "./parsed_env";

let server: Hapi.Server;

export const initializeServer = async () => {
  if (server) {
    return server;
  }

  server = Hapi.server({
    host: parsed_env.API_URL,
    port: parsed_env.PORT,
  });

  server.validator(zod_adapter);

  define_routes(server);

  await server.initialize();
  await server.start();

  return server;
};
