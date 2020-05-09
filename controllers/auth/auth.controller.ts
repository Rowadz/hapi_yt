import { Connection, Repository } from 'typeorm';
import { ServerRoute, ResponseToolkit, Request } from 'hapi';
import { UsersEntity } from '../../db/entities';
import { genSalt } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const authController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'POST',
      path: '/register',
      handler: async (
        { payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const {
          firstName,
          lastName,
          email,
          password,
          birthOfDate,
        } = payload as Partial<UsersEntity>;
        const salt = await genSalt();
        const u = new UsersEntity(
          firstName,
          lastName,
          email,
          password,
          salt,
          birthOfDate
        );
        await userRepo.save(u);
        delete u.password;
        delete u.salt;
        return {
          user: u,
          accessToken: sign(u, 'getMeFromEnvFile'),
        };
      },
    },
  ];
};
