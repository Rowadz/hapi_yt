import { Connection, Repository } from 'typeorm';
import { UsersEntity } from '../../db/entities';
import { ResponseToolkit, ServerRoute, Request } from 'hapi';

export const userController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'GET',
      path: '/users',
      handler: async ({ query }: Request, h: ResponseToolkit, err?: Error) => {
        let { perPage, page, ...q } = query;
        let realPage: number;
        let realTake: number;
        if (perPage) realTake = +perPage;
        else {
          perPage = '10';
          realTake = 10;
        }
        if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake;
        else {
          realPage = 0;
          page = '1';
        }
        const findOptions = {
          take: realTake,
          skip: realPage,
          where: { ...q },
        };
        if (!q) delete findOptions.where;
        const getQuery = () =>
          Object.keys(q)
            .map((key) => `${key}=${q[key]}`)
            .join('&');
        const qp: string = getQuery().length === 0 ? '' : `&${getQuery()}`;
        const data = await userRepo.find(findOptions);
        return {
          data: data.map((u: UsersEntity) => {
            delete u.salt;
            delete u.password;
            return u;
          }),
          perPage: realTake,
          page: +page || 1,
          next: `http://localhost:3000/users?perPage=${realTake}&page=${
            +page + 1
          }${qp}`,
          prev: `http://localhost:3000/users?perPage=${realTake}&page=${
            +page - 1
          }${qp}`,
        };
      },
      options: {
        auth: {
          strategy: 'jwt',
        },
      },
    },
    {
      method: 'GET',
      path: '/users/{id}',
      async handler(
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) {
        const u: UsersEntity = await userRepo.findOne(id);
        delete u.password;
        delete u.salt;
        return u;
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
        delete u.password;
        delete u.salt;
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
        delete u.password;
        delete u.salt;
        return u;
      },
    },
  ];
};
