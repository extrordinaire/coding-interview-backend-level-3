import { initializeServer, startServer } from "./server"

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received: stopping Hapi server...');
  await getServer.stop({ timeout: 5000 });     // wait up to 5s for connections to close :contentReference[oaicite:3]{index=3}
  process.exit(0);
});

startServer()
