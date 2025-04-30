import Hapi from '@hapi/hapi';

const defineRoutes = (server) => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: async (request, h) => {
      return {
        ok: true
      };
    }
  });
};

const getServer = () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3e3
  });
  defineRoutes(server);
  return server;
};
const startServer = async () => {
  const server = getServer();
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
await startServer();
