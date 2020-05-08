import { Connection, Repository } from 'typeorm';
import { UsersEntity } from '../../db/entities';
import { ResponseToolkit } from 'hapi';

export const UserController = (con: Connection) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return {
    get: {
      method: 'GET',
      path: '/',
      handler: async (request: Request, h: ResponseToolkit, err?: Error) =>
        userRepo.find(),
    },
  };
};
