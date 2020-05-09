import * as Hapi from '@hapi/hapi';
import { Server, ResponseToolkit, Request } from 'hapi';
import { initDb } from './db';
import 'colors';
import { get } from 'node-emoji';
import { userController, postsController } from './controllers';
import { Connection } from 'typeorm';
import * as HapiJWT from 'hapi-auth-jwt2';
import { validate } from './auth';

const init = async () => {
  const server: Server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register(HapiJWT);
  server.auth.strategy('jwt', 'jwt', {
    key: 'NeverShareYourSecret', // Never Share your secret key
    validate, // validate function defined above
  });
  const con: Connection = await initDb();
  console.log(get('dvd'), 'DB init -> Done!'.green, get('dvd'));
  server.route([...userController(con), ...postsController(con)]);
  await server.start();
  console.log(
    get('rocket'),
    `Server running on ${server.info.uri}`.green,
    get('rocket')
  );
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
