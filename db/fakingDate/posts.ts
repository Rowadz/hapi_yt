import { name, lorem, random } from 'faker';
import { Connection, Repository } from 'typeorm';
import { PostsEntity, UsersEntity } from '../entities';
import 'colors';
import { get } from 'node-emoji';

export const fakePosts = async (con: Connection, amount: number = 50) => {
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  const users: Array<UsersEntity> = await userRepo.find(); // pass { take: number }
  for (const user of users) {
    const shouldWeCreate: boolean = random.arrayElement([false, true]);
    if (shouldWeCreate) {
      const title = name.jobTitle();
      const body = lorem.paragraphs();
      const title2 = name.jobTitle();
      const body2 = lorem.paragraphs();
      const p: Partial<PostsEntity> = new PostsEntity(title, body);
      p.user = user;
      const p2: Partial<PostsEntity> = new PostsEntity(title2, body2);
      p2.user = user;
      await postRepo.save<Partial<PostsEntity>>(p);
      await postRepo.save<Partial<PostsEntity>>(p2);
    }
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${amount} users`.magenta.bold, emoji);
};
