import { Connection, Repository } from 'typeorm';
import { UsersEntity } from '../../db/entities';
import { ResponseToolkit, ServerRoute, Request } from 'hapi';

export const userController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'GET',
      path: '/users',
      handler: (request: Request, h: ResponseToolkit, err?: Error) =>
        userRepo.find(),
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
