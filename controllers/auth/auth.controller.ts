import { Connection, Repository } from 'typeorm';
import { ServerRoute, ResponseToolkit, Request } from 'hapi';
import { UsersEntity } from '../../db/entities';

export const authController = (con: Connection): Array<ServerRoute> => {
  const postRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [];
};
