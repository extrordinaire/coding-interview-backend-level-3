'use strict';

var Hapi = require('@hapi/hapi');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var Hapi__namespace = /*#__PURE__*/_interopNamespaceDefault(Hapi);

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
  const server = Hapi__namespace.server({
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
startServer();
