import * as Hapi from '@hapi/hapi';
import { Server, ResponseToolkit, Request } from 'hapi';
import { initDb } from './db';

const init = async () => {
  const server: Server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // request - the request object.
  // h - the response toolkit the handler must call to set a response and return control back to the framework.
  // err - an error object availble only when the method is used as a failAction value.
  server.route({
    method: 'GET',
    path: '/',
    handler: (request: Request, h: ResponseToolkit, err?: Error) => {
      return { msg: 'hello world' };
    },
  });
  await initDb();
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
