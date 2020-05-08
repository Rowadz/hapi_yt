import { name, internet, date, random } from 'faker';
import { Connection, Repository } from 'typeorm';
import { UsersEntity, UserType } from '../entities';
import 'colors';
import { get } from 'node-emoji';

export const fakeUsers = async (con: Connection, amount: number = 50) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  for (const _ of Array.from({ length: amount })) {
    const firstName = name.firstName();
    const lastName = name.lastName();
    const birthOfDate = date.past();
    const email = internet.email();
    const type: UserType = random.arrayElement(['admin', 'user']);
    const u: Partial<UsersEntity> = new UsersEntity(
      firstName,
      lastName,
      email,
      birthOfDate,
      type
    );
    await userRepo.save<Partial<UsersEntity>>(u);
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${amount} users`.magenta.bold, emoji);
};
