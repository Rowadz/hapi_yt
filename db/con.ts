import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

export const initDb = async (): Promise<Connection> => {
  const con = await createConnection({
    type: 'sqlite',
    // this will be created relatvie to the path where you call this function
    database: './hapi.db',
  });
  await con.synchronize(true);
  return con;
};
