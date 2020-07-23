import jwt from 'jsonwebtoken';

const isLoggedIn = (token: string | undefined): boolean => {
  if(process.env.ALLOWED_GROUPS===undefined) {
    return false;
  }
  const allowedGroups = process.env.ALLOWED_GROUPS.split(',');

  if (!token) return false;

  const payload: any = jwt.decode(token);

  if (allowedGroups === undefined) {
    return false;
  }

  return (
    payload &&
    payload.groups &&
    payload.groups.some((g: string) => allowedGroups.includes(g))
  );
};

export default isLoggedIn;
