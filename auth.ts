import { Request, ResponseToolkit } from '@hapi/hapi';

export const validateJWT = async (
  decoded: object,
  request: Request,
  h: ResponseToolkit
) => {
  // do your checks to see if the person is valid
  console.log(decoded);
  //   if (!people[decoded.id]) {
  //     return { isValid: false };
  //   } else {
  //     return { isValid: true };
  //   }
};

export const validateBasic = async (
  request: Request,
  username: string,
  password: string,
  h: ResponseToolkit
) => {
  console.log(username, password);

  // const user = users[username];
  // if (!user) {
  // return { credentials: null, isValid: false };
  // }

  // const isValid = await Bcrypt.compare(password, user.password);
  // const credentials = { id: user.id, name: user.name };

  // credentials - a credentials object passed back to the application in `request.auth.credentials`.
  return { isValid: true, credentials: { nidce: 'true' } };
};
