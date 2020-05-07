import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SharedProp } from './sharedProp.entity';

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'birth_of_date', nullable: true })
  birthOfDate: Date;

  @Column({ default: 'user' })
  type: 'admin' | 'user';
}

/**
 * for the `type` use enum like this in mysql or postgres
 * enum UserType {
 *      user = 'user',
 *      admin = 'admin
 * }
 * @Column({ default: UserType.user, enum: UserType, type: 'enum' })
 * type: UserType;
 *
 */
