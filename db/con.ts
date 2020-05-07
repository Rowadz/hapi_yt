import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { UsersEntity } from './entities';

export const initDb = async (): Promise<Connection> => {
  const con = await createConnection({
    type: 'sqlite',
    // this will be created relatvie to the path where you call this function
    database: './hapi.db',
    entities: [UsersEntity],
  });
  await con.synchronize(true);
  return con;
};
