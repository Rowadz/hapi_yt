import { Connection, Repository } from 'typeorm';
import { UsersEntity } from '../../db/entities';
import { ResponseToolkit, ServerRoute, Request } from 'hapi';
import { string, object, date } from '@hapi/joi';

export const userController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'GET',
      path: '/users',
      handler: async ({ query }: Request, h: ResponseToolkit, err?: Error) => {
        const { perPage, page } = query;
        let realPage: number;
        let realTake: number;
        if (perPage) realTake = +perPage;
        else realTake = 10;
        if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake;
        else realPage = 0;

        return {
          data: await userRepo.find({ take: realTake, skip: realPage }),
          perPage: realTake,
          page: +page || 1,
          next: `http://localhost:3000/users?perPage=${realTake}&page=${page}`,
          prev: `http://localhost:3000/users?perPage=${realTake}&page=${
            +page - 1
          }`,
        };
      },
    },
    {
      method: 'GET',
      path: '/users/{id}',
      handler: ({ params: { id } }: Request, h: ResponseToolkit, err?: Error) =>
        userRepo.findOne(id),
    },
    {
      method: 'POST',
      path: '/users',
      handler: ({ payload }: Request, h: ResponseToolkit, err?: Error) => {
        // TODO:: anyone can select the type?? no!
        const { firstName, lastName, birthOfDate, email } = payload as Partial<
          UsersEntity
        >;

        const u: Partial<UsersEntity> = new UsersEntity(
          firstName,
          lastName,
          email,
          birthOfDate
        );
        return userRepo.save<Partial<UsersEntity>>(u);
      },
      options: {
        auth: false,
        validate: {
          payload: object({
            firstName: string().required().max(250).min(3),
            lastName: string().required().max(250).min(3),
            email: string().required().max(250).min(4),
            birthOfDate: date().optional(),
          }) as any,
          failAction: (request, h, err) => {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
    },
    {
      method: 'PATCH',
      path: '/users/{id}',
      handler: async (
        { params: { id }, payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const u = await userRepo.findOne(id);
        Object.keys(payload).forEach((key) => (u[key] = payload[key]));
        userRepo.update(id, u);
        return u;
      },
    },
    {
      method: 'DELETE',
      path: '/users/{id}',
      handler: async (
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const u = await userRepo.findOne(id);
        userRepo.remove(u);
        return u;
      },
    },
  ];
};
