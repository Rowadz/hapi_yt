import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { UsersEntity, PostsEntity } from './entities';
import { fakeUsers } from './fakingDate';
import 'colors';

export const initDb = async (): Promise<Connection> => {
  const entities = [UsersEntity, PostsEntity];
  const con = await createConnection({
    type: 'sqlite',
    // this will be created relatvie to the path where you call this function
    database: './hapi.db',
    entities,
  });
  await con.synchronize(true);
  entities.forEach((entity) => console.log(`Created ${entity.name}`.blue));
  console.log('Creating fake Data...'.yellow.bold);
  await fakeUsers(con);
  return con;
};
