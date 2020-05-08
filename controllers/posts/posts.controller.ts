import { Connection, Repository } from 'typeorm';
import { ServerRoute, ResponseToolkit, Request } from 'hapi';
import { PostsEntity } from '../../db/entities';

export const postsController = (con: Connection): Array<ServerRoute> => {
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  return [
    {
      method: 'GET',
      path: '/posts',
      handler: (request: Request, h: ResponseToolkit, err?: Error) =>
        postRepo.find({ relations: ['user'] }),
    },
    {
      method: 'GET',
      path: '/posts/{id}',
      handler: ({ params: { id } }: Request, h: ResponseToolkit, err?: Error) =>
        postRepo.findOne(id),
    },
    {
      method: 'POST',
      path: '/posts',
      handler: ({ payload }: Request, h: ResponseToolkit, err?: Error) => {
        const { title, body } = payload as Partial<PostsEntity>;
        const p: Partial<PostsEntity> = new PostsEntity(title, body);
        // TODO:: get the user form the jwt token
        return postRepo.save<Partial<PostsEntity>>(p);
      },
    },
    {
      method: 'PATCH',
      path: '/posts/{id}',
      handler: async (
        { params: { id }, payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const p = await postRepo.findOne(id);
        Object.keys(payload).forEach((key) => (p[key] = payload[key]));
        postRepo.update(id, p);
        return p;
      },
    },
    {
      method: 'DELETE',
      path: '/posts/{id}',
      handler: async (
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const p = await postRepo.findOne(id);
        postRepo.remove(p);
        return p;
      },
    },
  ];
};
