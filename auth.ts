import { Request, ResponseToolkit } from '@hapi/hapi';
import { Connection, Repository } from 'typeorm';
import { UsersEntity } from './db/entities';
import { compare, hash, genSalt } from 'bcrypt';

export const validateJWT = (con: Connection) => {
  return async (
    { id }: Partial<UsersEntity>,
    request: Request,
    h: ResponseToolkit
  ) => {
    const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
    const user: UsersEntity = await userRepo.findOne(id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true };
  };
};

export const validateBasic = (con: Connection) => {
  return async (
    request: Request,
    username: string,
    password: string,
    h: ResponseToolkit
  ) => {
    const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
    const user: UsersEntity = await userRepo.findOne({ email: username });
    if (!user) {
      return { credentials: null, isValid: false };
    }
    const isValid = (await hash(password, user.salt)) === user.password;
    delete user.password;
    delete user.salt;
    // credentials - a credentials object passed back to the application in `request.auth.credentials`.
    return { isValid: isValid, credentials: user };
  };
};
