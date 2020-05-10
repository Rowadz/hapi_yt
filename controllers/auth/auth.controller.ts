import { Connection, Repository } from 'typeorm';
import { UsersEntity } from '../../db/entities';
import { genSalt } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { string, object, date } from '@hapi/joi';
import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';

export const authController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'POST',
      path: '/login',
      async handler({ payload, auth }: Request, h: ResponseToolkit) {
        return {
          ...auth.credentials,
          accessToken: sign({ ...auth.credentials }, 'getMeFromEnvFile'),
        };
      },
      options: {
        auth: { strategy: 'simple' },
      },
    },
    {
      method: 'POST',
      path: '/register',
      async handler({ payload }: Request) {
        try {
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
            accessToken: sign({ ...u }, 'getMeFromEnvFile'),
          };
        } catch (error) {
          console.error(error);
          return { err: 'something went wrong :(' };
        }
      },
      options: {
        auth: false,
        validate: {
          payload: object({
            firstName: string().required().max(250).min(3),
            lastName: string().required().max(250).min(3),
            email: string().required().max(250).min(4),
            birthOfDate: date().optional().min('1950-01-01').max('2010-01-01'),
            password: string().required().min(5).max(15),
          }) as any,
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
    },
  ];
};
