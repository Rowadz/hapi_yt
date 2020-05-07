import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { UsersEntity } from './entities';
import 'colors';

export const initDb = async (): Promise<Connection> => {
  const entities = [UsersEntity];
  const con = await createConnection({
    type: 'sqlite',
    // this will be created relatvie to the path where you call this function
    database: './hapi.db',
    entities,
  });
  await con.synchronize(true);
  entities.forEach((entity) => console.log(`Created ${entity.name}`.blue));
  return con;
};
