import { Server } from "@hapi/hapi";
import { initializeServer } from "./server";
import { parsed_env } from "./parsed_env";

async function init_hapi() {
  let server: Server;

  process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
  });

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received: stopping Hapi server...");
    await server.stop({ timeout: 5000 });
    process.exit(0);
  });

  server = await initializeServer();
  console.log(`HAPI running on ${parsed_env.API_URL}:${parsed_env.PORT}`);
}

init_hapi();
